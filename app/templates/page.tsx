import type { Metadata } from "next";
import Link from "next/link";
import TemplateThumb from "@/components/TemplateThumb";
import { TEMPLATES } from "@/lib/templates";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Invoice Templates – 5 Professional PDF Designs",
  description:
    "Browse five free invoice templates. Pick a design, fill it in online and download a PDF invoice — no registration required.",
  path: "/templates",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Invoice templates", path: "/templates" },
        ])}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Free Invoice Templates
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Five designs, all free, all producing a real PDF. Every template supports your logo,
            per-line tax rates and 16 currencies — pick the one that suits your trade and start
            filling it in.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <article
              key={template.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex justify-center">
                <TemplateThumb templateId={template.id} width={240} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {template.name} invoice template
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{template.tagline}</p>
              <p className="mt-2 flex-1 text-sm text-slate-600">{template.description}</p>
              <Link
                href={`/templates/${template.slug}`}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Use this template
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="prose-seo mx-auto max-w-3xl px-4 py-12">
          <h2>How to choose an invoice template</h2>
          <p>
            The template matters less than the information on it, but it is not irrelevant. A
            document that looks considered gets processed faster, and a consistent design across
            every invoice you send makes your business look larger than it is.
          </p>
          <p>
            If you have a logo and a brand colour, the Modern template will carry them. If you do
            not, Minimal will look deliberate rather than unfinished. Professional and Classic suit
            corporate clients and anything that will be filed by an accountant, and Freelance leans
            warmer for solo work where the notes and terms are part of the message.
          </p>

          <h2>Do I need a different template for each document type?</h2>
          <p>
            No. Every template here works for invoices, receipts, estimates, quotes and proforma
            invoices — the document title and the date fields change automatically depending on
            which generator you start from.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/invoice-generator">Free invoice generator</Link>
            </li>
            <li>
              <Link href="/receipt-generator">Receipt generator</Link>
            </li>
            <li>
              <Link href="/estimate-generator">Estimate generator</Link>
            </li>
            <li>
              <Link href="/quote-generator">Quote generator</Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
