import type { DocumentKind } from "@/types/invoice";

export interface KindConfig {
  kind: DocumentKind;
  /** Title printed on the document itself. */
  title: string;
  /** Prefix for auto-generated numbers. */
  numberPrefix: string;
  numberLabel: string;
  dateLabel: string;
  dueLabel: string;
  /** Some documents have no due date (a receipt is already paid). */
  showDueDate: boolean;
  defaultNotes: string;
  defaultTerms: string;
}

export const KINDS: Record<DocumentKind, KindConfig> = {
  invoice: {
    kind: "invoice",
    title: "Invoice",
    numberPrefix: "INV",
    numberLabel: "Invoice number",
    dateLabel: "Invoice date",
    dueLabel: "Due date",
    showDueDate: true,
    defaultNotes: "Thank you for your business.",
    defaultTerms: "Payment due within 30 days.",
  },
  receipt: {
    kind: "receipt",
    title: "Receipt",
    numberPrefix: "REC",
    numberLabel: "Receipt number",
    dateLabel: "Payment date",
    dueLabel: "",
    showDueDate: false,
    defaultNotes: "Paid in full. Thank you.",
    defaultTerms: "This receipt confirms payment has been received.",
  },
  estimate: {
    kind: "estimate",
    title: "Estimate",
    numberPrefix: "EST",
    numberLabel: "Estimate number",
    dateLabel: "Estimate date",
    dueLabel: "Valid until",
    showDueDate: true,
    defaultNotes: "This estimate is not a request for payment.",
    defaultTerms: "Prices are an estimate and may change once work is scoped.",
  },
  quote: {
    kind: "quote",
    title: "Quote",
    numberPrefix: "QUO",
    numberLabel: "Quote number",
    dateLabel: "Quote date",
    dueLabel: "Valid until",
    showDueDate: true,
    defaultNotes: "We look forward to working with you.",
    defaultTerms: "This quote is fixed price and valid for 30 days.",
  },
  proforma: {
    kind: "proforma",
    title: "Proforma Invoice",
    numberPrefix: "PRO",
    numberLabel: "Proforma number",
    dateLabel: "Issue date",
    dueLabel: "Payment due",
    showDueDate: true,
    defaultNotes: "This is a proforma invoice and not a demand for payment.",
    defaultTerms: "Goods remain the property of the seller until paid in full.",
  },
};

export function getKind(kind: DocumentKind): KindConfig {
  return KINDS[kind] ?? KINDS.invoice;
}
