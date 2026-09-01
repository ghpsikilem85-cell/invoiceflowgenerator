import { CURRENCIES } from "@/lib/currency";
import { KINDS } from "@/lib/document-kinds";
import { TEMPLATES } from "@/lib/templates";
import type { DiscountType, DocumentKind, Invoice, InvoiceItem } from "@/types/invoice";

export const LIMITS = {
  text: 400,
  longText: 2000,
  items: 100,
  /** Data-URL logo cap for anonymous/free use, in bytes of decoded image. */
  logoBytes: 2 * 1024 * 1024,
};

const CURRENCY_CODES = new Set(CURRENCIES.map((c) => c.code));
const TEMPLATE_IDS = new Set(TEMPLATES.map((t) => t.id));
const KIND_NAMES = new Set(Object.keys(KINDS));

export class ValidationError extends Error {}

/**
 * Everything that reaches the PDF renderer or the database goes through here.
 * The client is not trusted: totals are recomputed server-side and every
 * string is clipped so a crafted payload cannot blow up the renderer.
 */
export function parseInvoice(input: unknown): Invoice {
  if (!isRecord(input)) throw new ValidationError("Invoice payload must be an object.");

  const kind = str(input.kind, 20);
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) throw new ValidationError("At least one line item is required.");
  if (items.length > LIMITS.items) {
    throw new ValidationError(`A document cannot have more than ${LIMITS.items} line items.`);
  }

  return {
    kind: (KIND_NAMES.has(kind) ? kind : "invoice") as DocumentKind,
    invoice_number: str(input.invoice_number, 60) || "INV-0001",

    business_name: str(input.business_name, LIMITS.text),
    business_email: str(input.business_email, LIMITS.text),
    business_address: str(input.business_address, LIMITS.longText),
    business_phone: str(input.business_phone, LIMITS.text),
    business_tax_id: str(input.business_tax_id, LIMITS.text),
    business_logo: parseLogo(input.business_logo),

    customer_name: str(input.customer_name, LIMITS.text),
    customer_email: str(input.customer_email, LIMITS.text),
    customer_address: str(input.customer_address, LIMITS.longText),

    invoice_date: date(input.invoice_date),
    due_date: date(input.due_date),

    currency: CURRENCY_CODES.has(str(input.currency, 3)) ? str(input.currency, 3) : "USD",

    items: items.slice(0, LIMITS.items).map(parseItem),

    discount_type: (str(input.discount_type, 10) === "fixed" ? "fixed" : "percent") as DiscountType,
    discount_value: num(input.discount_value, 0, 1_000_000),

    notes: str(input.notes, LIMITS.longText),
    payment_terms: str(input.payment_terms, LIMITS.longText),

    template_id: TEMPLATE_IDS.has(str(input.template_id, 40))
      ? str(input.template_id, 40)
      : "modern",
    status: "draft",
  };
}

function parseItem(raw: unknown, index: number): InvoiceItem {
  if (!isRecord(raw)) throw new ValidationError(`Line item ${index + 1} is malformed.`);
  return {
    id: str(raw.id, 40) || `item-${index}`,
    description: str(raw.description, LIMITS.longText),
    quantity: num(raw.quantity, 0, 1_000_000),
    unit_price: num(raw.unit_price, -1_000_000_000, 1_000_000_000),
    tax_rate: num(raw.tax_rate, 0, 100),
  };
}

function parseLogo(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return null;
  const match = /^data:image\/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) return null;
  const bytes = Math.floor((match[2].length * 3) / 4);
  if (bytes > LIMITS.logoBytes) throw new ValidationError("Logo must be 2 MB or smaller.");
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max);
}

function num(value: unknown, min: number, max: number): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(parsed, min), max);
}

function date(value: unknown): string {
  const raw = str(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
}

/** File-name safe slug for the downloaded PDF. */
export function pdfFileName(invoice: Invoice): string {
  const base = `${invoice.kind}-${invoice.invoice_number || "document"}`;
  return `${base.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-")}.pdf`;
}
