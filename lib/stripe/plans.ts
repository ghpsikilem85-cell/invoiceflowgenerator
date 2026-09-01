export type PaidPlan = "pro" | "business";
export type Plan = "free" | PaidPlan;
export type BillingInterval = "month" | "year";

export interface PlanDefinition {
  id: Plan;
  name: string;
  summary: string;
  /** Display prices, in USD. Stripe holds the authoritative amounts. */
  monthly: number;
  yearly: number;
  features: string[];
  highlight: boolean;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    summary: "Everything you need to bill a client today.",
    monthly: 0,
    yearly: 0,
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
    id: "pro",
    name: "Pro",
    summary: "For people who invoice every week.",
    monthly: 7.99,
    yearly: 79.9,
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
    id: "business",
    name: "Business",
    summary: "For teams and anyone integrating invoicing.",
    monthly: 19.99,
    yearly: 199.9,
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

/**
 * Price IDs live in the environment rather than the code so the same build can
 * point at Stripe test mode locally and live mode in production.
 */
export function priceIdFor(plan: PaidPlan, interval: BillingInterval): string | undefined {
  const key = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`;
  return process.env[key] || undefined;
}

/** True when both intervals of a plan have a price configured. */
export function isPlanPurchasable(plan: PaidPlan): boolean {
  return Boolean(priceIdFor(plan, "month") ?? priceIdFor(plan, "year"));
}

/** Maps a Stripe price ID back to the plan it belongs to, for the webhook. */
export function planForPriceId(priceId: string): PaidPlan | null {
  for (const plan of ["pro", "business"] as PaidPlan[]) {
    for (const interval of ["month", "year"] as BillingInterval[]) {
      if (priceIdFor(plan, interval) === priceId) return plan;
    }
  }
  return null;
}

export function yearlySavingMonths(plan: PlanDefinition): number {
  if (plan.monthly === 0) return 0;
  return Math.round(12 - plan.yearly / plan.monthly);
}
