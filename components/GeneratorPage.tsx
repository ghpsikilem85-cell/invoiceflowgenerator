import Link from "next/link";
import InvoiceEditor from "@/components/InvoiceEditor";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, softwareJsonLd, type FaqItem } from "@/lib/seo";
import type { DocumentKind } from "@/types/invoice";

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  orderedList?: string[];
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface GeneratorPageProps {
  path: string;
  h1: string;
  intro: string;
  kind?: DocumentKind;
  templateId?: string;
  currency?: string;
  canSave?: boolean;
  bullets?: string[];
  /** Long-form copy below the tool — this is what the page actually ranks on. */
  sections: ContentSection[];
  faq: FaqItem[];
  related?: RelatedLink[];
  breadcrumbs?: { name: string; path: string }[];
}

export default function GeneratorPage({
  path,
  h1,
  intro,
  kind = "invoice",
  templateId,
  currency,
  canSave = false,
  bullets,
  sections,
  faq,
  related,
  breadcrumbs,
}: GeneratorPageProps) {
  return (
    <>
      <JsonLd data={softwareJsonLd({ name: h1, description: intro, path })} />
      <JsonLd data={faqJsonLd(faq)} />
      {breadcrumbs ? <JsonLd data={breadcrumbJsonLd(breadcrumbs)} /> : null}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {h1}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">{intro}</p>
          {bullets?.length ? (
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-1.5">
                  <span aria-hidden className="text-emerald-600">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <InvoiceEditor kind={kind} templateId={templateId} currency={currency} canSave={canSave} />

      <section className="border-t border-slate-200 bg-white">
        <div className="prose-seo mx-auto max-w-3xl px-4 py-12">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              ) : null}
              {section.orderedList ? (
                <ol>
                  {section.orderedList.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ol>
              ) : null}
            </div>
          ))}

          <h2>Frequently asked questions</h2>
          <dl className="not-prose divide-y divide-slate-200 border-y border-slate-200">
            {faq.map((item) => (
              <div key={item.question} className="py-4">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-1 text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>

          {related?.length ? (
            <>
              <h2>Related tools</h2>
              <ul>
                {related.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
