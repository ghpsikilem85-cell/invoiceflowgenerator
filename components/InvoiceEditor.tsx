"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InvoicePreview from "@/components/InvoicePreview";
import { CURRENCIES, formatMoney } from "@/lib/currency";
import { getKind } from "@/lib/document-kinds";
import { createInvoice, emptyItem } from "@/lib/defaults";
import { TEMPLATES } from "@/lib/templates";
import { calculateTotals } from "@/lib/totals";
import type { DocumentKind, Invoice, InvoiceItem } from "@/types/invoice";

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const SHEET_WIDTH = 794;

interface Props {
  kind?: DocumentKind;
  templateId?: string;
  currency?: string;
  /** Signed-in users get the Save button; anonymous users see a prompt. */
  canSave?: boolean;
}

export default function InvoiceEditor({
  kind = "invoice",
  templateId,
  currency,
  canSave = false,
}: Props) {
  // Deliberately not renamed alongside the brand: the key identifies drafts
  // already sitting in visitors' browsers, and changing it would discard them.
  const storageKey = `invoiceflow:draft:${kind}`;
  const config = getKind(kind);

  const [invoice, setInvoice] = useState<Invoice>(() => {
    const base = createInvoice(kind);
    return {
      ...base,
      template_id: templateId ?? base.template_id,
      currency: currency ?? base.currency,
    };
  });
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [busy, setBusy] = useState<null | "pdf" | "save">(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  // Restore the draft once on mount; the server render must not depend on it.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Invoice;
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setInvoice({ ...parsed, kind });
        }
      }
    } catch {
      // A corrupt draft should never block the editor.
    }
    setHydrated(true);
  }, [storageKey, kind]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(invoice));
    } catch {
      // Quota exceeded (usually a large logo) — the editor keeps working.
    }
  }, [invoice, storageKey, hydrated]);

  const patch = useCallback((changes: Partial<Invoice>) => {
    setInvoice((current) => ({ ...current, ...changes }));
  }, []);

  const patchItem = useCallback((id: string, changes: Partial<InvoiceItem>) => {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
  }, []);

  const addItem = useCallback(() => {
    setInvoice((current) => ({ ...current, items: [...current.items, emptyItem()] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice((current) => ({
      ...current,
      items:
        current.items.length > 1
          ? current.items.filter((item) => item.id !== id)
          : [emptyItem()],
    }));
  }, []);

  const totals = useMemo(() => calculateTotals(invoice), [invoice]);

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ tone: "error", text: "Logo must be an image file." });
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      setMessage({ tone: "error", text: "Logo must be 2 MB or smaller." });
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    patch({ business_logo: dataUrl });
    setMessage(null);
  }

  async function downloadPdf() {
    setBusy("pdf");
    setMessage(null);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Could not generate the PDF." }));
        throw new Error(body.error ?? "Could not generate the PDF.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.kind}-${invoice.invoice_number || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage({ tone: "ok", text: "PDF downloaded." });
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not generate the PDF.",
      });
    } finally {
      setBusy(null);
    }
  }

  async function saveInvoice() {
    setBusy("save");
    setMessage(null);
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Could not save the invoice.");
      setInvoice((current) => ({ ...current, id: body.id }));
      setMessage({ tone: "ok", text: "Saved to your dashboard." });
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not save the invoice.",
      });
    } finally {
      setBusy(null);
    }
  }

  function resetDraft() {
    const base = createInvoice(kind);
    setInvoice({
      ...base,
      template_id: invoice.template_id,
      currency: invoice.currency,
    });
    setMessage(null);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      {/* Mobile tab switch */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-slate-200 p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`rounded-md py-2 text-sm font-semibold ${
            tab === "edit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`rounded-md py-2 text-sm font-semibold ${
            tab === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <section className={`${tab === "edit" ? "block" : "hidden"} lg:block`}>
          <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
            <TemplatePicker
              value={invoice.template_id}
              onChange={(id) => patch({ template_id: id })}
            />

            <Group title="Your business">
              <Field
                label="Business name"
                value={invoice.business_name}
                onChange={(v) => patch({ business_name: v })}
                placeholder="Northwind Studio"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Email"
                  type="email"
                  value={invoice.business_email}
                  onChange={(v) => patch({ business_email: v })}
                  placeholder="billing@example.com"
                />
                <Field
                  label="Phone"
                  value={invoice.business_phone}
                  onChange={(v) => patch({ business_phone: v })}
                  placeholder="+1 555 010 4477"
                />
              </div>
              <TextArea
                label="Address"
                value={invoice.business_address}
                onChange={(v) => patch({ business_address: v })}
                placeholder={"128 Bridge Street\nBrooklyn, NY 11201"}
              />
              <Field
                label="Tax ID / VAT number"
                value={invoice.business_tax_id}
                onChange={(v) => patch({ business_tax_id: v })}
                placeholder="EIN 88-1234567"
              />
              <LogoField
                logo={invoice.business_logo}
                onSelect={handleLogo}
                onClear={() => patch({ business_logo: null })}
              />
            </Group>

            <Group title="Customer">
              <Field
                label="Customer name"
                value={invoice.customer_name}
                onChange={(v) => patch({ customer_name: v })}
                placeholder="John Smith"
              />
              <Field
                label="Customer email"
                type="email"
                value={invoice.customer_email}
                onChange={(v) => patch({ customer_email: v })}
                placeholder="john@acme.com"
              />
              <TextArea
                label="Customer address"
                value={invoice.customer_address}
                onChange={(v) => patch({ customer_address: v })}
                placeholder={"Acme Corp\n900 Market Street\nSan Francisco, CA 94103"}
              />
            </Group>

            <Group title={`${config.title} details`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label={config.numberLabel}
                  value={invoice.invoice_number}
                  onChange={(v) => patch({ invoice_number: v })}
                />
                <div>
                  <label className="field-label" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    id="currency"
                    className="field-input"
                    value={invoice.currency}
                    onChange={(event) => patch({ currency: event.target.value })}
                  >
                    {CURRENCIES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} — {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label={config.dateLabel}
                  type="date"
                  value={invoice.invoice_date}
                  onChange={(v) => patch({ invoice_date: v })}
                />
                {config.showDueDate ? (
                  <Field
                    label={config.dueLabel}
                    type="date"
                    value={invoice.due_date}
                    onChange={(v) => patch({ due_date: v })}
                  />
                ) : null}
              </div>
            </Group>

            <Group title="Items">
              <div className="space-y-3">
                {invoice.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Item {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <TextArea
                      label="Description"
                      rows={2}
                      value={item.description}
                      onChange={(v) => patchItem(item.id, { description: v })}
                      placeholder="Website design"
                    />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <NumberField
                        label="Qty"
                        value={item.quantity}
                        min={0}
                        step={1}
                        onChange={(v) => patchItem(item.id, { quantity: v })}
                      />
                      <NumberField
                        label="Unit price"
                        value={item.unit_price}
                        step={0.01}
                        onChange={(v) => patchItem(item.id, { unit_price: v })}
                      />
                      <NumberField
                        label="Tax %"
                        value={item.tax_rate}
                        min={0}
                        max={100}
                        step={0.1}
                        onChange={(v) => patchItem(item.id, { tax_rate: v })}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addItem}
                className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600"
              >
                + Add item
              </button>
            </Group>

            <Group title="Discount & notes">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="discount-type">
                    Discount type
                  </label>
                  <select
                    id="discount-type"
                    className="field-input"
                    value={invoice.discount_type}
                    onChange={(event) =>
                      patch({ discount_type: event.target.value as Invoice["discount_type"] })
                    }
                  >
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <NumberField
                  label={invoice.discount_type === "percent" ? "Discount %" : "Discount amount"}
                  value={invoice.discount_value}
                  min={0}
                  step={0.01}
                  onChange={(v) => patch({ discount_value: v })}
                />
              </div>
              <TextArea
                label="Payment terms"
                value={invoice.payment_terms}
                onChange={(v) => patch({ payment_terms: v })}
              />
              <TextArea
                label="Notes"
                value={invoice.notes}
                onChange={(v) => patch({ notes: v })}
              />
            </Group>

            <div className="rounded-lg bg-slate-900 p-4 text-white">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal, invoice.currency)}</span>
              </div>
              {totals.discount > 0 ? (
                <div className="mt-1 flex items-center justify-between text-sm text-slate-300">
                  <span>Discount</span>
                  <span>-{formatMoney(totals.discount, invoice.currency)}</span>
                </div>
              ) : null}
              {totals.tax > 0 ? (
                <div className="mt-1 flex items-center justify-between text-sm text-slate-300">
                  <span>Tax</span>
                  <span>{formatMoney(totals.tax, invoice.currency)}</span>
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between border-t border-slate-700 pt-3 text-lg font-bold">
                <span>Total</span>
                <span>{formatMoney(totals.total, invoice.currency)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetDraft}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Clear and start a new {config.title.toLowerCase()}
            </button>
          </div>
        </section>

        <section className={`${tab === "preview" ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-20">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={downloadPdf}
                disabled={busy !== null}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {busy === "pdf" ? "Preparing PDF…" : "Download PDF"}
              </button>

              {canSave ? (
                <button
                  type="button"
                  onClick={saveInvoice}
                  disabled={busy !== null}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  {busy === "save" ? "Saving…" : "Save invoice"}
                </button>
              ) : (
                <a
                  href="/login"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign in to save
                </a>
              )}

              {message ? (
                <p
                  role="status"
                  className={`text-sm ${
                    message.tone === "ok" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {message.text}
                </p>
              ) : null}
            </div>

            <ScaledSheet>
              <InvoicePreview invoice={invoice} />
            </ScaledSheet>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Shrinks the fixed-width A4 sheet to whatever column width is available. */
function ScaledSheet({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(1123);

  useEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return;

    const update = () => {
      const width = container.clientWidth;
      if (width > 0) setScale(Math.min(1, width / SHEET_WIDTH));
      setSheetHeight(sheet.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* transform: scale does not affect layout, so the wrapper carries the
          scaled height to stop a large gap appearing under the preview. */}
      <div style={{ height: sheetHeight * scale }}>
        <div
          ref={sheetRef}
          style={{
            width: SHEET_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="shadow-lg ring-1 ring-slate-200"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-bold text-slate-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const parsed = Number.parseFloat(event.target.value);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        className="field-input resize-y"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function LogoField({
  logo,
  onSelect,
  onClear,
}: {
  logo: string | null;
  onSelect: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <span className="field-label">Logo (PNG or JPG, max 2 MB)</span>
      <div className="flex items-center gap-3">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt="Business logo preview"
            className="h-12 w-12 rounded border border-slate-200 object-contain"
          />
        ) : null}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => onSelect(event.target.files?.[0])}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
        />
        {logo ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TemplatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <span className="field-label">Template</span>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((template) => {
          const active = template.id === value;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                active
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: template.accent }}
                aria-hidden
              />
              {template.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
