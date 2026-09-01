import Stripe from "stripe";

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let stripe: Stripe | null = null;

/** Returns null when Stripe is not configured, so pages can degrade. */
export function getStripe(): Stripe | null {
  if (!isStripeConfigured) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // Pinned so a Stripe-side version bump cannot change behaviour under us.
      apiVersion: "2026-08-26.dahlia",
      appInfo: { name: "InvoiceFlowGenerator" },
    });
  }
  return stripe;
}
