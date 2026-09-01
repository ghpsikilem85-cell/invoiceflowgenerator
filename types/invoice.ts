export type DocumentKind = "invoice" | "receipt" | "estimate" | "quote" | "proforma";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type DiscountType = "percent" | "fixed";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

export interface Invoice {
  id?: string;
  kind: DocumentKind;
  invoice_number: string;

  business_name: string;
  business_email: string;
  business_address: string;
  business_phone: string;
  business_tax_id: string;
  business_logo: string | null;

  customer_name: string;
  customer_email: string;
  customer_address: string;

  invoice_date: string;
  due_date: string;

  currency: string;

  items: InvoiceItem[];

  discount_type: DiscountType;
  discount_value: number;

  notes: string;
  payment_terms: string;

  template_id: string;
  status: InvoiceStatus;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
