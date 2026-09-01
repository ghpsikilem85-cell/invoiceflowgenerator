import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "Plain-language terms for using InvoiceFlow.",
  path: "/terms",
});

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
      <p className="mt-3 text-slate-600">Plain-language terms for using InvoiceFlow.</p>
      <div className="prose-seo mt-6">
          <h2>Using the service</h2>
          <p>You may use the free generator for personal or commercial invoicing without an account. You are responsible for the accuracy of everything you put on a document you create here.</p>
          <h2>No professional advice</h2>
          <p>The guidance on this site describes common practice in invoicing and taxation. It is not legal, tax or accounting advice, requirements differ by jurisdiction and change over time, and you should confirm your obligations with a qualified professional.</p>
          <h2>Your content</h2>
          <p>You keep all rights to the invoices, logos and business data you enter. We claim no ownership of them and do not use them for any purpose other than providing the service to you.</p>
          <h2>Availability</h2>
          <p>The service is provided as is, without warranty. We aim for continuous availability but do not guarantee it, and we are not liable for losses arising from downtime or from errors in a document you generated.</p>
          <h2>Acceptable use</h2>
          <p>Do not use the service to create fraudulent documents, to impersonate another business, or to place unreasonable automated load on it. We may restrict access where we detect abuse.</p>
          <h2>Changes</h2>
          <p>These terms may change as the service develops. Material changes will be noted on this page.</p>
      </div>
    </div>
  );
}
