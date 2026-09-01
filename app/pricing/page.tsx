import type { Metadata } from "next";
import PricingPlans from "@/components/PricingPlans";
import { isPlanPurchasable, type Plan } from "@/lib/stripe/plans";
import { isStripeConfigured } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing – Free Invoice Generator, Pro and Business Plans",
  description:
    "Unlimited free invoices and PDF downloads. Pro at $7.99/month for saved invoices, 50+ templates and automation. Business at $19.99/month with API access.",
  path: "/pricing",
});

// Reads the signed-in user's plan, so it cannot be statically rendered.
export const dynamic = "force-dynamic";

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
    question: "How do I cancel?",
    answer:
      "From the billing portal, reachable with the Manage billing button on this page or from your dashboard. Cancelling stops the renewal; you keep access until the end of the period you have paid for.",
  },
  {
    question: "Can I switch between monthly and yearly?",
    answer:
      "Yes, in the billing portal. Stripe prorates the change, so you are credited for the time you have already paid for.",
  },
  {
    question: "Which payment methods do you take?",
    answer:
      "Card payments are handled by Stripe. Your card details never touch our servers — checkout and billing management both happen on Stripe's own pages.",
  },
];

export default async function Page() {
  const supabase = await createClient();

  let signedIn = false;
  let currentPlan: Plan = "free";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = Boolean(user);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.plan) currentPlan = profile.plan as Plan;
    }
  }

  const purchasable = {
    pro: isStripeConfigured && isPlanPurchasable("pro"),
    business: isStripeConfigured && isPlanPurchasable("business"),
  };

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
        <PricingPlans purchasable={purchasable} signedIn={signedIn} currentPlan={currentPlan} />
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
