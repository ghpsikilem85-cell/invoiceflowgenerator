"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CURRENCIES } from "@/lib/currency";
import { createInvoice, newId } from "@/lib/defaults";
import {
  MAX_INPUT_CHARS,
  REMINDER_TONES,
  TRANSLATION_LANGUAGES,
  type AiTool,
  type ReminderTone,
} from "@/lib/ai/tools";

interface ToolDef {
  id: AiTool;
  name: string;
  blurb: string;
  placeholder: string;
  rows: number;
}

const TOOLS: ToolDef[] = [
  {
    id: "invoice_draft",
    name: "Invoice from a sentence",
    blurb:
      "Describe the job the way you would to a colleague. You get line items you can open straight in the generator.",
    placeholder: "Website design for John Smith, $1,500. Plus 3 days of support at $400 a day.",
    rows: 3,
  },
  {
    id: "description",
    name: "Improve a description",
    blurb: "Turn a terse line item into something a client's finance team can match to a PO.",
    placeholder: "logo stuff + some revisions",
    rows: 2,
  },
  {
    id: "reminder",
    name: "Payment reminder",
    blurb: "A chasing email for an overdue invoice. Paste the invoice details, pick a tone.",
    placeholder:
      "Invoice INV-0042 for $2,200, issued 3 March, due 2 April. Client: Acme Corp, contact Sarah. Now 18 days overdue.",
    rows: 4,
  },
  {
    id: "email",
    name: "Invoice email",
    blurb: "The covering email you send with the PDF the first time.",
    placeholder:
      "Invoice INV-0043 for $1,500 covering website design, due 30 April. Client: John Smith at Acme Corp.",
    rows: 4,
  },
  {
    id: "translate",
    name: "Translate",
    blurb:
      "Translate invoice text into your client's language. Numbers, dates and company names are left alone.",
    placeholder: "Payment due within 30 days. Late payments are subject to a 2% monthly charge.",
    rows: 4,
  },
];

interface DraftItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceDraftResult {
  customer_name: string;
  items: DraftItem[];
  currency: string;
  notes: string;
}

interface SubjectBody {
  subject: string;
  body: string;
}

export default function AiTools({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState<AiTool>("invoice_draft");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<ReminderTone>("polite");
  const [language, setLanguage] = useState("de");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [copied, setCopied] = useState(false);

  const tool = TOOLS.find((entry) => entry.id === active)!;

  function selectTool(id: AiTool) {
    setActive(id);
    setInput("");
    setResult(null);
    setError(null);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: active, input, tone, language }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "The request failed.");
      setResult(body.result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The request failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setError("Could not reach the clipboard. Select the text and copy it manually.");
    }
  }

  /** Seeds the editor's stored draft, then opens it. */
  function openInGenerator(draft: InvoiceDraftResult) {
    const base = createInvoice("invoice");
    const currency = CURRENCIES.some((entry) => entry.code === draft.currency)
      ? draft.currency
      : base.currency;

    const invoice = {
      ...base,
      customer_name: draft.customer_name || base.customer_name,
      currency,
      notes: draft.notes || base.notes,
      items:
        draft.items.length > 0
          ? draft.items.map((item) => ({
              id: newId(),
              description: item.description,
              quantity: Number.isFinite(item.quantity) ? item.quantity : 1,
              unit_price: Number.isFinite(item.unit_price) ? item.unit_price : 0,
              tax_rate: 0,
            }))
          : base.items,
    };

    try {
      window.localStorage.setItem("invoiceflow:draft:invoice", JSON.stringify(invoice));
    } catch {
      setError("Could not hand the draft over — your browser storage is full.");
      return;
    }
    router.push("/invoice-generator");
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-semibold">AI tools are not configured on this deployment.</p>
        <p className="mt-1">
          Set <code>ANTHROPIC_API_KEY</code> in your environment and restart the server. Everything
          else on the site works without it.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {TOOLS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => selectTool(entry.id)}
            aria-current={entry.id === active}
            className={`shrink-0 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold lg:shrink ${
              entry.id === active
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {entry.name}
          </button>
        ))}
      </nav>

      <section>
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">{tool.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{tool.blurb}</p>

          <textarea
            className="field-input mt-4 resize-y"
            rows={tool.rows}
            value={input}
            maxLength={MAX_INPUT_CHARS}
            placeholder={tool.placeholder}
            onChange={(event) => setInput(event.target.value)}
          />

          {active === "reminder" ? (
            <label className="mt-3 block">
              <span className="field-label">Tone</span>
              <select
                className="field-input"
                value={tone}
                onChange={(event) => setTone(event.target.value as ReminderTone)}
              >
                {REMINDER_TONES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry === "polite"
                      ? "Polite — assume it was overlooked"
                      : entry === "firm"
                        ? "Firm — ask for a payment date"
                        : "Final — reference the agreed terms"}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {active === "translate" ? (
            <label className="mt-3 block">
              <span className="field-label">Translate into</span>
              <select
                className="field-input"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {TRANSLATION_LANGUAGES.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={busy || input.trim().length === 0}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? "Working…" : "Generate"}
            </button>
            <span className="text-xs text-slate-400">
              {input.length}/{MAX_INPUT_CHARS}
            </span>
          </div>

          {error ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </form>

        {result != null ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 font-bold text-slate-900">Result</h3>

            {active === "invoice_draft" ? (
              <DraftResult
                draft={result as InvoiceDraftResult}
                onOpen={() => openInGenerator(result as InvoiceDraftResult)}
              />
            ) : active === "reminder" || active === "email" ? (
              <SubjectBodyResult
                value={result as SubjectBody}
                copied={copied}
                onCopy={copy}
              />
            ) : (
              <TextResult value={String(result)} copied={copied} onCopy={copy} />
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function TextResult({
  value,
  copied,
  onCopy,
}: {
  value: string;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  return (
    <>
      <p className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-slate-800">{value}</p>
      <CopyButton copied={copied} onClick={() => onCopy(value)} />
    </>
  );
}

function SubjectBodyResult({
  value,
  copied,
  onCopy,
}: {
  value: SubjectBody;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</p>
      <p className="mt-1 font-medium text-slate-900">{value.subject}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Body</p>
      <p className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-slate-800">
        {value.body}
      </p>
      <CopyButton
        copied={copied}
        onClick={() => onCopy(`Subject: ${value.subject}\n\n${value.body}`)}
      />
    </>
  );
}

function DraftResult({ draft, onOpen }: { draft: InvoiceDraftResult; onOpen: () => void }) {
  const total = draft.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  return (
    <>
      {draft.customer_name ? (
        <p className="text-sm text-slate-600">
          Customer: <span className="font-semibold text-slate-900">{draft.customer_name}</span>
        </p>
      ) : null}

      <table className="mt-3 w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Qty</th>
            <th className="pb-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {draft.items.map((item, index) => (
            <tr key={`${item.description}-${index}`}>
              <td className="py-2 pr-3 text-slate-800">{item.description}</td>
              <td className="py-2 text-right text-slate-700">{item.quantity}</td>
              <td className="py-2 text-right text-slate-700">{item.unit_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-300">
            <td className="pt-2 font-semibold text-slate-900" colSpan={2}>
              Total {draft.currency ? `(${draft.currency})` : ""}
            </td>
            <td className="pt-2 text-right font-semibold text-slate-900">{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      {draft.notes ? (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{draft.notes}</p>
      ) : null}

      <p className="mt-4 text-xs text-slate-500">
        Check the figures before sending — this is a draft, not a reading of a contract.
      </p>

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Open in the invoice generator →
      </button>
    </>
  );
}

function CopyButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
