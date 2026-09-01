import type { Invoice, InvoiceItem, InvoiceTotals } from "@/types/invoice";

export function lineTotal(item: InvoiceItem): number {
  return round2(item.quantity * item.unit_price);
}

export function calculateTotals(invoice: Invoice): InvoiceTotals {
  const subtotal = round2(
    invoice.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  );

  const discount =
    invoice.discount_type === "percent"
      ? round2((subtotal * clamp(invoice.discount_value, 0, 100)) / 100)
      : round2(clamp(invoice.discount_value, 0, subtotal));

  // Discount is applied proportionally so per-line tax rates stay meaningful.
  const discountRatio = subtotal > 0 ? discount / subtotal : 0;

  const tax = round2(
    invoice.items.reduce((sum, item) => {
      const net = item.quantity * item.unit_price * (1 - discountRatio);
      return sum + (net * item.tax_rate) / 100;
    }, 0)
  );

  return { subtotal, discount, tax, total: round2(subtotal - discount + tax) };
}

export function round2(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
