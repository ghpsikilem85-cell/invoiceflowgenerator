import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "This policy explains what InvoiceFlowGenerator collects, why, and what it does not collect.",
  path: "/privacy",
});

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-slate-600">This policy explains what InvoiceFlowGenerator collects, why, and what it does not collect.</p>
      <div className="prose-seo mt-6">
          <h2>What the generator stores</h2>
          <p>The invoice you are working on is kept in your own browser using local storage. It is not sent anywhere until you press Download PDF or Save invoice, and it stays on the device you typed it on.</p>
          <p>Clearing your browser data removes it. We cannot recover a draft for you because we never had it.</p>
          <h2>What happens when you download a PDF</h2>
          <p>The invoice data is sent to our server, rendered into a PDF, and returned to your browser. The data and the generated file are held only for the duration of that request and are not written to storage or logs.</p>
          <h2>What we store if you create an account</h2>
          <p>An account stores your email address, the invoices you explicitly save, their line items, and the customers and business profile attached to them. Row level security in the database restricts every one of those rows to your own account.</p>
          <p>You can delete your account and its data at any time by contacting us.</p>
          <h2>Analytics</h2>
          <p>If Google Analytics is enabled on this deployment, it records aggregate page views. It does not receive the contents of your invoices.</p>
          <h2>Cookies</h2>
          <p>The only cookies set are the session cookies required to keep you signed in. There are no advertising or cross-site tracking cookies.</p>
          <h2>Contact</h2>
          <p>For any privacy question, or to request deletion of your data, contact us through the address published on the site.</p>
      </div>
    </div>
  );
}
