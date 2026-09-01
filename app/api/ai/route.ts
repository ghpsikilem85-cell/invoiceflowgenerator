import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { AI_EFFORT, AI_MODEL, aiRequiresPro, getAiClient, isAiConfigured } from "@/lib/ai/client";
import {
  DESCRIPTION_SYSTEM,
  EMAIL_SYSTEM,
  EmailSchema,
  INVOICE_DRAFT_SYSTEM,
  InvoiceDraftSchema,
  MAX_INPUT_CHARS,
  REMINDER_TONES,
  ReminderSchema,
  TRANSLATION_LANGUAGES,
  reminderSystem,
  translationSystem,
  type AiTool,
  type ReminderTone,
} from "@/lib/ai/tools";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TOKENS = 4000;

export async function POST(request: Request) {
  if (!isAiConfigured) {
    return NextResponse.json(
      { error: "AI tools are not configured on this deployment." },
      { status: 501 }
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Accounts are not configured." }, { status: 501 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to use the AI tools." }, { status: 401 });

  if (aiRequiresPro) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    if (!profile || profile.plan === "free") {
      return NextResponse.json(
        { error: "AI tools are available on the Pro plan." },
        { status: 402 }
      );
    }
  }

  // Per-user rather than per-IP: this endpoint costs money on every call.
  const limit = rateLimit(`ai:${user.id}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many AI requests. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const tool = String(payload.tool ?? "") as AiTool;
  const input = String(payload.input ?? "").slice(0, MAX_INPUT_CHARS).trim();

  if (!input) return NextResponse.json({ error: "Nothing to work on." }, { status: 400 });

  const client = getAiClient()!;

  try {
    const result = await run(client, tool, input, payload);
    if (!result) return NextResponse.json({ error: "Unknown AI tool." }, { status: 400 });

    // Best-effort usage log; a failure here must not lose the user's result.
    await supabase
      .from("ai_requests")
      .insert({
        user_id: user.id,
        feature: tool,
        input_tokens: result.usage.input,
        output_tokens: result.usage.output,
      })
      .then(({ error }) => {
        if (error) console.error("AI usage log failed", error);
      });

    return NextResponse.json({ result: result.output });
  } catch (error) {
    return NextResponse.json({ error: describeError(error) }, { status: statusFor(error) });
  }
}

interface RunResult {
  output: unknown;
  usage: { input: number; output: number };
}

async function run(
  client: Anthropic,
  tool: AiTool,
  input: string,
  payload: Record<string, unknown>
): Promise<RunResult | null> {
  switch (tool) {
    case "invoice_draft":
      return parsed(client, INVOICE_DRAFT_SYSTEM, input, InvoiceDraftSchema);

    case "description":
      return text(client, DESCRIPTION_SYSTEM, `Rewrite this invoice line:\n\n${input}`);

    case "reminder": {
      const raw = String(payload.tone ?? "polite") as ReminderTone;
      const tone = REMINDER_TONES.includes(raw) ? raw : "polite";
      return parsed(
        client,
        reminderSystem(tone),
        `Write a payment reminder for this invoice:\n\n${input}`,
        ReminderSchema
      );
    }

    case "email":
      return parsed(
        client,
        EMAIL_SYSTEM,
        `Write the covering email for this invoice:\n\n${input}`,
        EmailSchema
      );

    case "translate": {
      const code = String(payload.language ?? "de");
      const language = TRANSLATION_LANGUAGES.find((entry) => entry.code === code);
      if (!language) return null;
      return text(client, translationSystem(language.label), input);
    }

    default:
      return null;
  }
}

async function text(client: Anthropic, system: string, prompt: string): Promise<RunResult> {
  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    output_config: { effort: AI_EFFORT },
    system,
    messages: [{ role: "user", content: prompt }],
  });

  guardRefusal(response.stop_reason);

  const output = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  return { output, usage: usageOf(response) };
}

async function parsed<S extends z.ZodType>(
  client: Anthropic,
  system: string,
  prompt: string,
  schema: S
): Promise<RunResult> {
  const response = await client.messages.parse({
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    output_config: { effort: AI_EFFORT, format: zodOutputFormat(schema) },
    system,
    messages: [{ role: "user", content: prompt }],
  });

  guardRefusal(response.stop_reason);

  if (!response.parsed_output) {
    throw new Error("The model did not return a usable result. Try rephrasing.");
  }

  return { output: response.parsed_output, usage: usageOf(response) };
}

function usageOf(response: { usage: { input_tokens: number; output_tokens: number } }) {
  return { input: response.usage.input_tokens, output: response.usage.output_tokens };
}

/** A safety decline arrives as HTTP 200, so stop_reason has to be checked. */
function guardRefusal(stopReason: string | null) {
  if (stopReason === "refusal") {
    throw new Error("The model declined this request. Try rephrasing it.");
  }
}

function statusFor(error: unknown): number {
  if (error instanceof Anthropic.RateLimitError) return 429;
  if (error instanceof Anthropic.AuthenticationError) return 500;
  if (error instanceof Anthropic.APIError) return 502;
  return 500;
}

function describeError(error: unknown): string {
  if (error instanceof Anthropic.RateLimitError) {
    return "The AI service is rate limited right now. Try again shortly.";
  }
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("Anthropic auth failed", error);
    return "The AI service is misconfigured.";
  }
  if (error instanceof Anthropic.APIError) {
    console.error("Anthropic API error", error.status, error.message);
    return "The AI service could not be reached. Try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
