import Anthropic from "@anthropic-ai/sdk";

/** The model every AI tool runs on. */
export const AI_MODEL = "claude-opus-5";

/**
 * These tools are short rewriting and extraction jobs, not reasoning-heavy
 * work, so they run at low effort. Adaptive thinking stays on — disabling it
 * on Opus 5 risks tool calls and internal tags leaking into visible text.
 */
export const AI_EFFORT = "low" as const;

export const isAiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

/**
 * Requiring a paid plan is off until Stripe billing exists — enforcing it now
 * would gate a feature nobody can subscribe to. Set AI_REQUIRE_PRO=true once
 * checkout is live.
 */
export const aiRequiresPro = process.env.AI_REQUIRE_PRO === "true";

let client: Anthropic | null = null;

export function getAiClient(): Anthropic | null {
  if (!isAiConfigured) return null;
  if (!client) client = new Anthropic();
  return client;
}
