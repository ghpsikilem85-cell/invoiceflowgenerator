import type { Metadata } from "next";
import Link from "next/link";
import TemplateThumb from "@/components/TemplateThumb";
import { TEMPLATES } from "@/lib/templates";
import { PROFESSION_PAGES } from "@/lib/content/professions";
import { JsonLd, faqJsonLd, pageMetadata, softwareJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Free Invoice Generator – Create PDF Invoices Online",
  description: SITE.description,
  path: "/",
});

const STEPS = [
  {
    title: "Enter your details",
    body: "Your business, your customer, and the work you are billing for. Nothing is required except a line item.",
  },
  {
    title: "Customise your invoice",
    body: "Pick a template, add your logo, set the currency, and put a tax rate on each line.",
  },
  {
    title: "Download the PDF",
    body: "A real A4 PDF with selectable text, no watermark, ready to email or print.",
  },
];

const FAQ = [
  {
    question: "Is this invoice generator free?",
    answer:
      "Yes. Creating invoices and downloading PDFs is free and unlimited with no account required.",
  },
  {
    question: "Do I need to sign up?",
    answer:
      "No. An account is only needed if you want your invoices saved to a dashboard you can reach from another device.",
  },
  {
    question: "Is there a watermark on the PDF?",
    answer: "No. The downloaded PDF carries your branding, not ours.",
  },
  {
    question: "Can I use it on my phone?",
    answer:
      "Yes. On small screens the editor splits into Edit and Preview tabs so both are usable.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={softwareJsonLd({
          name: "Free Invoice Generator",
          description: SITE.description,
          path: "/",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Free Invoice Generator
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Create professional invoices in seconds.
          </p>
          <Link
            href="/invoice-generator"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Create free invoice
          </Link>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
            {["No registration required", "Free PDF download", "Multiple currencies"].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span aria-hidden className="text-emerald-600">
                    ✓
                  </span>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Popular invoice templates
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.slice(0, 4).map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.slug}`}
                className="group flex flex-col items-center rounded-xl border border-slate-200 p-4 hover:border-blue-400"
              >
                <TemplateThumb templateId={template.id} width={200} />
                <span className="mt-3 font-semibold text-slate-900 group-hover:text-blue-700">
                  {template.name}
                </span>
                <span className="text-xs text-slate-500">{template.tagline}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/templates" className="font-semibold text-blue-600 hover:text-blue-700">
              See all templates →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-slate-900">Built for your trade</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          Each of these pages starts from a template and a set of line items that suit the work,
          with billing guidance specific to the trade.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROFESSION_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/invoice-generator/${page.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700"
            >
              {page.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="prose-seo mx-auto max-w-3xl px-4 py-14">
          <h2>What is an invoice?</h2>
          <p>
            An invoice is a document a seller issues to a buyer listing what was supplied, what it
            cost and when payment is due. It is the record that turns completed work into a debt
            the client owes you, and it is the document your accountant and the tax office will
            ask to see.
          </p>

          <h2>How to create an invoice</h2>
          <p>
            Enter your business details, add the customer, list the work line by line with a
            quantity and a price, set a tax rate where one applies, and give the document a unique
            number and a due date. The{" "}
            <Link href="/invoice-generator">free invoice generator</Link> does the arithmetic and
            produces the PDF.
          </p>

          <h2>What should an invoice include?</h2>
          <ul>
            <li>The word &quot;Invoice&quot; and a unique sequential number</li>
            <li>Your business name, address and tax registration number</li>
            <li>The customer&apos;s name and billing address</li>
            <li>The invoice date and the payment due date</li>
            <li>An itemised description of the goods or services</li>
            <li>Subtotal, tax, discount and the total amount due</li>
            <li>Payment terms and how to pay you</li>
          </ul>

          <h2>Invoice vs receipt</h2>
          <p>
            An invoice requests payment; a{" "}
            <Link href="/receipt-generator">receipt</Link> confirms payment was made. If a client
            pays on the spot you only need the receipt. If they pay on terms you will issue both.
          </p>

          <h2>Invoice vs estimate</h2>
          <p>
            An <Link href="/estimate-generator">estimate</Link> is an approximation of what work
            will cost and creates no obligation to pay. A{" "}
            <Link href="/quote-generator">quote</Link> is a fixed price you can be held to. The
            invoice comes after the work, not before it.
          </p>

          <h2>Frequently asked questions</h2>
          <dl className="not-prose divide-y divide-slate-200 border-y border-slate-200">
            {FAQ.map((item) => (
              <div key={item.question} className="py-4">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-1 text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
