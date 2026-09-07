import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { isAdsEnabled } from "@/lib/ads";
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
          <h2>Advertising</h2>
          {isAdsEnabled ? (
            <>
              <p>This site is paid for by advertising. Ads are served by Google AdSense, which is a third party with its own privacy policy. Google and its partners may set cookies or read device identifiers in order to serve and measure ads, and in some configurations to personalise them based on your previous visits to this and other sites.</p>
              <p>We do not send Google the contents of your invoices. The editor never transmits your draft anywhere except when you press Download PDF or Save invoice, and ad units are not placed inside the editor.</p>
              <p>You can control what Google shows you at <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">adssettings.google.com</a>, and read how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener" target="_blank">policies.google.com/technologies/partner-sites</a>.</p>
              <p>If you are in the European Economic Area, the United Kingdom or Switzerland, you will be asked for consent before personalised advertising cookies are set, and you can change or withdraw that choice at any time.</p>
            </>
          ) : (
            <p>No advertising is served on this site at present. If that changes, this policy will be updated before any advertising cookie is set.</p>
          )}
          <h2>Cookies</h2>
          <p>Session cookies keep you signed in; without them an account would be unusable. Where Google Analytics is enabled it sets its own analytics cookies.{isAdsEnabled ? " Advertising cookies are described in the section above." : ""}</p>
          <p>Blocking cookies in your browser does not stop you using the invoice generator. It runs without an account and stores your draft in local storage on your own device.</p>
          <h2>Contact</h2>
          <p>For any privacy question, or to request deletion of your account and its data, write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Please write from the address you signed up with so we can be sure the request is yours. See also the <Link href="/contact">contact page</Link>.</p>
      </div>
    </div>
  );
}
