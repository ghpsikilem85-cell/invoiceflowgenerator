import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends a subscriber to Stripe's own billing portal to change plan, update a
 * card or cancel. Doing it there rather than in our UI keeps card details off
 * our infrastructure entirely.
 */
export async function POST() {
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
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: "You do not have a subscription yet." }, { status: 400 });
  }

  try {
    const session = await getStripe()!.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${SITE.url}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Billing portal session failed", error);
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: 502 });
  }
}
