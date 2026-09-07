import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Get in touch with ${SITE.name} — support, corrections, privacy requests and business enquiries.`,
  path: "/contact",
});

const REASONS = [
  {
    title: "Something is broken",
    body: "A PDF that will not download, a total that looks wrong, a page that fails to load. Tell us what you were doing and which browser you use, and it gets looked at.",
  },
  {
    title: "A correction",
    body: "A tax rate that has moved, a required field missing for your country, a guide that is out of date. Corrections are welcome and get applied.",
  },
  {
    title: "Your data",
    body: "To ask what is stored about you, or to have your account and its invoices deleted, write from the address you signed up with.",
  },
  {
    title: "Business",
    body: "Advertising, partnerships or anything commercial.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Contact</h1>
      <p className="mt-3 text-lg text-slate-600">
        One address, read by a person. Expect a reply within a few working days.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-1 block text-xl font-bold text-blue-600 hover:text-blue-700"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {REASONS.map((reason) => (
          <div key={reason.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-900">{reason.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{reason.body}</p>
          </div>
        ))}
      </div>

      <div className="prose-seo mt-10">
        <h2>What we cannot help with</h2>
        <p>
          We cannot tell you what tax to charge, whether you need to register for VAT, or how to
          treat a transaction in your accounts. Those answers depend on your country, your turnover
          and your legal structure, and getting them wrong is expensive — ask a qualified
          accountant in your jurisdiction.
        </p>
        <p>
          We also cannot recover an invoice you did not save. Drafts live in your own browser; if
          you cleared your browser data, the draft is gone and we never had a copy.
        </p>

        <h2>Business details</h2>
        <p>
          {SITE.name} is operated by RainbowPrint Lab LLC. See the{" "}
          <Link href="/about">about page</Link>, the{" "}
          <Link href="/privacy">privacy policy</Link> and the{" "}
          <Link href="/terms">terms of service</Link>.
        </p>
      </div>
    </div>
  );
}
