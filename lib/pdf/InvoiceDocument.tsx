import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatDate } from "@/lib/currency";
import { getKind } from "@/lib/document-kinds";
import { getTemplate } from "@/lib/templates";
import { calculateTotals, lineTotal } from "@/lib/totals";
import { formatMoneyPdf, pdfText } from "@/lib/pdf/format";
import type { Invoice } from "@/types/invoice";

const styles = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 48, fontSize: 9.5, color: "#0f172a" },
  body: { paddingHorizontal: 44, paddingTop: 40 },
  banner: { height: 10, width: "100%" },
  row: { flexDirection: "row" },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  logo: { maxHeight: 56, maxWidth: 160, marginBottom: 10, objectFit: "contain" },
  businessName: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  muted: { color: "#475569", lineHeight: 1.5 },
  title: { fontSize: 24, fontFamily: "Helvetica-Bold" },
  metaRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 3 },
  metaLabel: { color: "#64748b", marginRight: 10 },
  metaValue: { fontFamily: "Helvetica-Bold" },
  rule: { height: 1, width: "100%", marginVertical: 22 },
  sectionLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    color: "#64748b",
    marginBottom: 3,
  },
  tableHead: { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 8 },
  tableHeadCell: { fontSize: 7.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.1 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  colDescription: { flex: 1 },
  colQty: { width: 46, textAlign: "right" },
  colPrice: { width: 78, textAlign: "right" },
  colTax: { width: 42, textAlign: "right" },
  colAmount: { width: 82, textAlign: "right" },
  totals: { marginTop: 18, marginLeft: "auto", width: 230 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 6,
    borderRadius: 3,
  },
  grandTotalText: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  footer: { marginTop: 34 },
  notes: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#e2e8f0" },
  notesBoxed: { marginTop: 14, padding: 12, borderRadius: 4 },
  pageNumber: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
});

export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const template = getTemplate(invoice.template_id);
  const kind = getKind(invoice.kind);
  const totals = calculateTotals(invoice);
  const currency = invoice.currency;
  const centered = template.layout === "centered";
  const serif = template.fontFamily === "serif";
  const font = serif ? "Times-Roman" : "Helvetica";
  const fontBold = serif ? "Times-Bold" : "Helvetica-Bold";

  const title = template.uppercaseTitle ? kind.title.toUpperCase() : kind.title;
  const money = (value: number) => formatMoneyPdf(value, currency);

  const businessLines = [
    invoice.business_address,
    invoice.business_email,
    invoice.business_phone,
    invoice.business_tax_id,
  ]
    .filter(Boolean)
    .join("\n");

  const customerLines = [invoice.customer_address, invoice.customer_email]
    .filter(Boolean)
    .join("\n");

  const align = centered ? ("center" as const) : ("left" as const);

  return (
    <Document
      title={`${kind.title} ${invoice.invoice_number}`}
      author={invoice.business_name || "InvoiceFlow"}
    >
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        {template.layout === "banner" ? (
          <View style={[styles.banner, { backgroundColor: template.accent }]} />
        ) : null}

        <View style={styles.body}>
          <View
            style={
              centered
                ? { alignItems: "center" }
                : { flexDirection: "row", justifyContent: "space-between" }
            }
          >
            <View style={centered ? { alignItems: "center" } : { maxWidth: 260 }}>
              {invoice.business_logo ? (
                <Image style={styles.logo} src={invoice.business_logo} />
              ) : null}
              <Text style={[styles.businessName, { fontFamily: fontBold, textAlign: align }]}>
                {pdfText(invoice.business_name || "Your business name")}
              </Text>
              {businessLines ? (
                <Text style={[styles.muted, { textAlign: align }]}>{pdfText(businessLines)}</Text>
              ) : null}
            </View>

            <View style={centered ? { alignItems: "center", marginTop: 14 } : { minWidth: 200 }}>
              <Text
                style={[
                  styles.title,
                  { color: template.accent, fontFamily: fontBold, textAlign: centered ? "center" : "right" },
                ]}
              >
                {title}
              </Text>
              <MetaRow label={kind.numberLabel} value={invoice.invoice_number} bold={fontBold} />
              <MetaRow
                label={kind.dateLabel}
                value={formatDate(invoice.invoice_date)}
                bold={fontBold}
              />
              {kind.showDueDate && invoice.due_date ? (
                <MetaRow
                  label={kind.dueLabel}
                  value={formatDate(invoice.due_date)}
                  bold={fontBold}
                />
              ) : null}
            </View>
          </View>

          <View
            style={[
              styles.rule,
              {
                backgroundColor:
                  template.layout === "minimal" ? "#e2e8f0" : template.accent,
              },
            ]}
          />

          <View style={centered ? { alignItems: "center" } : undefined}>
            <Text style={[styles.sectionLabel, { fontFamily: fontBold }]}>BILL TO</Text>
            <Text style={{ fontFamily: fontBold, textAlign: align }}>
              {pdfText(invoice.customer_name || "Customer name")}
            </Text>
            {customerLines ? (
              <Text style={[styles.muted, { textAlign: align }]}>{pdfText(customerLines)}</Text>
            ) : null}
          </View>

          <View style={{ marginTop: 24 }}>
            <View
              style={[
                styles.tableHead,
                { backgroundColor: template.headerBg },
              ]}
            >
              <Text
                style={[styles.tableHeadCell, styles.colDescription, { color: template.headerText, fontFamily: fontBold }]}
              >
                DESCRIPTION
              </Text>
              <Text
                style={[styles.tableHeadCell, styles.colQty, { color: template.headerText, fontFamily: fontBold }]}
              >
                QTY
              </Text>
              <Text
                style={[styles.tableHeadCell, styles.colPrice, { color: template.headerText, fontFamily: fontBold }]}
              >
                PRICE
              </Text>
              <Text
                style={[styles.tableHeadCell, styles.colTax, { color: template.headerText, fontFamily: fontBold }]}
              >
                TAX
              </Text>
              <Text
                style={[styles.tableHeadCell, styles.colAmount, { color: template.headerText, fontFamily: fontBold }]}
              >
                AMOUNT
              </Text>
            </View>

            {invoice.items.map((item) => (
              <View key={item.id} style={styles.tableRow} wrap={false}>
                <Text style={styles.colDescription}>{pdfText(item.description || "-")}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>{money(item.unit_price)}</Text>
                <Text style={styles.colTax}>{item.tax_rate ? `${item.tax_rate}%` : "-"}</Text>
                <Text style={[styles.colAmount, { fontFamily: fontBold }]}>
                  {money(lineTotal(item))}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalsRow}>
              <Text style={styles.muted}>Subtotal</Text>
              <Text style={{ fontFamily: fontBold }}>{money(totals.subtotal)}</Text>
            </View>
            {totals.discount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.muted}>
                  {invoice.discount_type === "percent"
                    ? `Discount (${invoice.discount_value}%)`
                    : "Discount"}
                </Text>
                <Text style={{ fontFamily: fontBold }}>-{money(totals.discount)}</Text>
              </View>
            ) : null}
            {totals.tax > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.muted}>Tax</Text>
                <Text style={{ fontFamily: fontBold }}>{money(totals.tax)}</Text>
              </View>
            ) : null}
            <View style={[styles.grandTotal, { backgroundColor: template.headerBg }]}>
              <Text style={[styles.grandTotalText, { color: template.headerText, fontFamily: fontBold }]}>
                TOTAL
              </Text>
              <Text style={[styles.grandTotalText, { color: template.headerText, fontFamily: fontBold }]}>
                {money(totals.total)}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            {invoice.payment_terms ? (
              <View>
                <Text style={[styles.sectionLabel, { fontFamily: fontBold }]}>PAYMENT TERMS</Text>
                <Text style={styles.muted}>{pdfText(invoice.payment_terms)}</Text>
              </View>
            ) : null}
            {invoice.notes ? (
              <View
                style={
                  template.layout === "sidebar"
                    ? [styles.notesBoxed, { backgroundColor: template.headerBg }]
                    : styles.notes
                }
              >
                <Text style={[styles.sectionLabel, { fontFamily: fontBold }]}>NOTES</Text>
                <Text style={styles.muted}>{pdfText(invoice.notes)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ""
          }
          fixed
        />
      </Page>
    </Document>
  );
}

function MetaRow({ label, value, bold }: { label: string; value: string; bold: string }) {
  if (!value) return null;
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={[styles.metaValue, { fontFamily: bold }]}>{pdfText(value)}</Text>
    </View>
  );
}
