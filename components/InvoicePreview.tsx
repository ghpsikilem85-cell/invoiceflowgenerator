import { formatDate, formatMoney } from "@/lib/currency";
import { getKind } from "@/lib/document-kinds";
import { getTemplate } from "@/lib/templates";
import { calculateTotals, lineTotal } from "@/lib/totals";
import type { Invoice } from "@/types/invoice";

/**
 * The on-screen rendering of a document. `lib/pdf/InvoiceDocument.tsx` mirrors
 * this layout for the downloadable PDF — both read the same TemplateSpec so
 * colours and structure stay in step.
 */
export default function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const template = getTemplate(invoice.template_id);
  const kind = getKind(invoice.kind);
  const totals = calculateTotals(invoice);
  const currency = invoice.currency;
  const font = template.fontFamily === "serif" ? "font-serif" : "font-sans";
  const centered = template.layout === "centered";

  const title = template.uppercaseTitle ? kind.title.toUpperCase() : kind.title;

  return (
    <article className={`sheet ${font} flex flex-col p-0 text-[13px] leading-relaxed`}>
      {template.layout === "banner" ? (
        <div className="h-3 w-full" style={{ background: template.accent }} />
      ) : null}

      <div className="flex flex-1 flex-col px-14 py-12">
        <header
          className={
            centered
              ? "flex flex-col items-center gap-3 text-center"
              : "flex items-start justify-between gap-10"
          }
        >
          <div className={centered ? "flex flex-col items-center gap-3" : ""}>
            {invoice.business_logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.business_logo}
                alt=""
                className="mb-3 max-h-20 max-w-[220px] object-contain"
              />
            ) : null}
            <div className="text-base font-bold text-slate-900">
              {invoice.business_name || "Your business name"}
            </div>
            <AddressBlock
              lines={[
                invoice.business_address,
                invoice.business_email,
                invoice.business_phone,
                invoice.business_tax_id,
              ]}
              centered={centered}
            />
          </div>

          <div className={centered ? "" : "text-right"}>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: template.accent }}
            >
              {title}
            </h1>
            <dl className={`mt-3 space-y-1 text-slate-600 ${centered ? "" : "text-right"}`}>
              <MetaRow label={kind.numberLabel} value={invoice.invoice_number} />
              <MetaRow label={kind.dateLabel} value={formatDate(invoice.invoice_date)} />
              {kind.showDueDate && invoice.due_date ? (
                <MetaRow label={kind.dueLabel} value={formatDate(invoice.due_date)} />
              ) : null}
            </dl>
          </div>
        </header>

        <div
          className="my-8 h-px w-full"
          style={{ background: template.layout === "minimal" ? "#e2e8f0" : template.accent }}
        />

        <section className={centered ? "text-center" : ""}>
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Bill to
          </h2>
          <div className="font-semibold text-slate-900">
            {invoice.customer_name || "Customer name"}
          </div>
          <AddressBlock
            lines={[invoice.customer_address, invoice.customer_email]}
            centered={centered}
          />
        </section>

        <table className="mt-8 w-full border-collapse">
          <thead>
            <tr style={{ background: template.headerBg, color: template.headerText }}>
              <th className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-widest">
                Description
              </th>
              <th className="w-20 px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-widest">
                Qty
              </th>
              <th className="w-28 px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-widest">
                Price
              </th>
              <th className="w-16 px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-widest">
                Tax
              </th>
              <th className="w-28 px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-widest">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-200 align-top">
                <td className="px-3 py-2.5 whitespace-pre-line text-slate-800">
                  {item.description || "—"}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-700">{item.quantity}</td>
                <td className="px-3 py-2.5 text-right text-slate-700">
                  {formatMoney(item.unit_price, currency)}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-700">
                  {item.tax_rate ? `${item.tax_rate}%` : "—"}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-slate-900">
                  {formatMoney(lineTotal(item), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <dl className="w-72 space-y-1.5">
            <TotalRow label="Subtotal" value={formatMoney(totals.subtotal, currency)} />
            {totals.discount > 0 ? (
              <TotalRow
                label={
                  invoice.discount_type === "percent"
                    ? `Discount (${invoice.discount_value}%)`
                    : "Discount"
                }
                value={`−${formatMoney(totals.discount, currency)}`}
              />
            ) : null}
            {totals.tax > 0 ? (
              <TotalRow label="Tax" value={formatMoney(totals.tax, currency)} />
            ) : null}
            <div
              className="mt-2 flex items-center justify-between rounded px-3 py-2.5 text-base font-bold"
              style={{ background: template.headerBg, color: template.headerText }}
            >
              <dt>Total</dt>
              <dd>{formatMoney(totals.total, currency)}</dd>
            </div>
          </dl>
        </div>

        <footer className="mt-auto pt-10">
          {invoice.payment_terms ? (
            <div className="mb-4">
              <h2 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Payment terms
              </h2>
              <p className="whitespace-pre-line text-slate-700">{invoice.payment_terms}</p>
            </div>
          ) : null}
          {invoice.notes ? (
            <div
              className={
                template.layout === "sidebar"
                  ? "rounded-lg p-4"
                  : "border-t border-slate-200 pt-4"
              }
              style={
                template.layout === "sidebar" ? { background: template.headerBg } : undefined
              }
            >
              <h2 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Notes
              </h2>
              <p className="whitespace-pre-line text-slate-700">{invoice.notes}</p>
            </div>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

function AddressBlock({ lines, centered }: { lines: string[]; centered: boolean }) {
  const visible = lines.filter(Boolean);
  if (visible.length === 0) return null;
  return (
    <div className={`mt-1 whitespace-pre-line text-slate-600 ${centered ? "text-center" : ""}`}>
      {visible.join("\n")}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-end gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 text-slate-700">
      <dt>{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
