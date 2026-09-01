import { getKind } from "@/lib/document-kinds";
import type { DocumentKind, Invoice, InvoiceItem } from "@/types/invoice";

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyItem(): InvoiceItem {
  return { id: newId(), description: "", quantity: 1, unit_price: 0, tax_rate: 0 };
}

function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function createInvoice(kind: DocumentKind = "invoice"): Invoice {
  const config = getKind(kind);
  return {
    kind,
    invoice_number: `${config.numberPrefix}-0001`,
    business_name: "",
    business_email: "",
    business_address: "",
    business_phone: "",
    business_tax_id: "",
    business_logo: null,
    customer_name: "",
    customer_email: "",
    customer_address: "",
    invoice_date: isoDate(0),
    due_date: config.showDueDate ? isoDate(30) : "",
    currency: "USD",
    items: [emptyItem()],
    discount_type: "percent",
    discount_value: 0,
    notes: config.defaultNotes,
    payment_terms: config.defaultTerms,
    template_id: "modern",
    status: "draft",
  };
}

/**
 * Sample data used for template previews and the marketing pages, so the
 * screenshots on the landing page are rendered by the same component the
 * editor uses.
 */
export function sampleInvoice(templateId = "modern"): Invoice {
  return {
    ...createInvoice("invoice"),
    invoice_number: "INV-0001",
    business_name: "Northwind Studio",
    business_email: "billing@northwind.studio",
    business_address: "128 Bridge Street\nBrooklyn, NY 11201",
    business_phone: "+1 (555) 010-4477",
    business_tax_id: "EIN 88-1234567",
    customer_name: "John Smith",
    customer_email: "john@acme.com",
    customer_address: "Acme Corp\n900 Market Street\nSan Francisco, CA 94103",
    items: [
      { id: "a", description: "Website design", quantity: 1, unit_price: 1500, tax_rate: 10 },
      { id: "b", description: "SEO setup", quantity: 1, unit_price: 500, tax_rate: 10 },
      { id: "c", description: "Support retainer (hours)", quantity: 4, unit_price: 75, tax_rate: 0 },
    ],
    template_id: templateId,
  };
}
