import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Who builds InvoiceFlowGenerator, why the invoice generator is free, and how the site makes money.",
  path: "/about",
});

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">About</h1>
      <p className="mt-3 text-lg text-slate-600">
        {SITE.name} is a free invoice generator for people who bill their own clients.
      </p>

      <div className="prose-seo mt-8">
        <h2>Why this exists</h2>
        <p>
          Most invoicing software is built for companies with an accounts department. If you are a
          freelancer, a contractor or a two-person studio, you do not need a subscription and an
          onboarding call to send someone a bill — you need a document with the right fields on it,
          today.
        </p>
        <p>
          So this site does one thing properly: you fill in a form, you watch the invoice build
          itself, and you download a real PDF. No account, no trial, no watermark.
        </p>

        <h2>What it costs</h2>
        <p>
          Nothing. Creating invoices and downloading PDFs is free and unlimited. An optional
          account saves your invoices to a dashboard, and that is free too.
        </p>
        <p>
          The site is paid for by advertising. Ads appear alongside the written guides and below
          the explanatory content — never inside the editor itself, because an ad next to the field
          where you type a client&apos;s bank details would be a bad trade for everyone.
        </p>

        <h2>Who writes it</h2>
        <p>
          {SITE.name} is operated by RainbowPrint Lab LLC. The guidance on the site — what an
          invoice must include, how VAT and GST invoices differ, what a proforma invoice is for —
          is written from published tax-authority requirements and general commercial practice.
        </p>
        <p>
          It is not legal, tax or accounting advice. Requirements differ by country and change over
          time, and only a qualified professional who knows your situation can tell you what
          applies to you.
        </p>

        <h2>Found something wrong?</h2>
        <p>
          If a rate is out of date or a required field is missing for your country, tell us and it
          gets fixed. Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or see the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
