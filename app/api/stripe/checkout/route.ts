import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { priceIdFor, type BillingInterval, type PaidPlan } from "@/lib/stripe/plans";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAID_PLANS: PaidPlan[] = ["pro", "business"];
const INTERVALS: BillingInterval[] = ["month", "year"];

export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 501 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Accounts are not configured." }, { status: 501 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to subscribe." }, { status: 401 });

  const limit = rateLimit(`checkout:${user.id}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let payload: { plan?: string; interval?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const plan = payload.plan as PaidPlan;
  const interval = payload.interval as BillingInterval;

  if (!PAID_PLANS.includes(plan) || !INTERVALS.includes(interval)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const priceId = priceIdFor(plan, interval);
  if (!priceId) {
    return NextResponse.json({ error: "That plan is not on sale yet." }, { status: 501 });
  }

  const stripe = getStripe()!;

  try {
    // Reuse the customer if this user has subscribed before, so their billing
    // history and payment methods stay on one Stripe customer.
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const customerId =
      existing?.stripe_customer_id ??
      (
        await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: { supabase_user_id: user.id },
        })
      ).id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      // The webhook is the source of truth, but the metadata lets it resolve
      // the user even if the customer record is somehow new.
      metadata: { supabase_user_id: user.id, plan },
      subscription_data: { metadata: { supabase_user_id: user.id, plan } },
      success_url: `${SITE.url}/dashboard?checkout=success`,
      cancel_url: `${SITE.url}/pricing?checkout=cancelled`,
    });

    if (!session.url) throw new Error("Stripe returned no checkout URL.");

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session failed", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
