import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing – Free Invoice Generator, Pro and Business Plans",
  description:
    "Unlimited free invoices and PDF downloads. Pro at $7.99/month for saved invoices, 50+ templates and automation. Business at $19.99/month with API access.",
  path: "/pricing",
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    summary: "Everything you need to bill a client today.",
    cta: { href: "/invoice-generator", label: "Create an invoice" },
    highlight: false,
    features: [
      "Unlimited invoice creation",
      "Unlimited PDF downloads",
      "5 templates",
      "Your logo",
      "Per-line tax rates",
      "16 currencies",
      "Basic customer details",
    ],
  },
  {
    name: "Pro",
    price: "$7.99",
    cadence: "per month",
    summary: "For people who invoice every week.",
    cta: { href: "/login", label: "Coming soon" },
    highlight: true,
    features: [
      "Everything in Free",
      "No ads",
      "Unlimited saved invoices",
      "Unlimited customers",
      "50+ templates",
      "Recurring invoices",
      "Email invoices to clients",
      "Payment links",
      "Custom branding",
      "Invoice history",
      "AI tools",
    ],
  },
  {
    name: "Business",
    price: "$19.99",
    cadence: "per month",
    summary: "For teams and anyone integrating invoicing.",
    cta: { href: "/login", label: "Coming soon" },
    highlight: false,
    features: [
      "Everything in Pro",
      "Team members",
      "API access",
      "Webhooks",
      "Advanced reports",
      "Bulk invoice generation",
    ],
  },
];

const FAQ = [
  {
    question: "Is the free plan really unlimited?",
    answer:
      "Yes. There is no cap on how many invoices you create or how many PDFs you download, and no watermark on the output.",
  },
  {
    question: "What is not in the free plan?",
    answer:
      "Saving invoices to an account, the extended template library, emailing invoices to clients, recurring invoices and the API. The generator itself is not limited.",
  },
  {
    question: "Do I need a card to use the free plan?",
    answer: "No. The free plan does not require an account at all, let alone a card.",
  },
  {
    question: "Are Pro and Business available yet?",
    answer:
      "Not yet. The free generator is live now; paid plans follow once recurring invoices, email delivery and payment links are finished.",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Pricing
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            The invoice generator is free and always will be. Paid plans exist for the work that
            happens around the invoice — saving, sending, chasing and integrating.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border bg-white p-6 ${
                plan.highlight ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
              }`}
            >
              <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{plan.summary}</p>
              <p className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>{" "}
                <span className="text-sm text-slate-500">{plan.cadence}</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden className="text-emerald-600">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="prose-seo mx-auto max-w-3xl px-4 py-12">
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
