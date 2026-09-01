import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { planForPriceId, type Plan } from "@/lib/stripe/plans";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Statuses that should actually unlock paid features. */
const ENTITLED_STATUSES = new Set(["active", "trialing"]);

const HANDLED_EVENTS = new Set<string>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  if (!isStripeConfigured || !isAdminConfigured) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 501 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — refusing to trust the payload.");
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = getStripe()!;
  // The raw body is required: the signature is computed over the exact bytes.
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    // Acknowledge anything we do not handle so Stripe stops retrying it.
    return NextResponse.json({ received: true });
  }

  try {
    await handle(stripe, event);
    return NextResponse.json({ received: true });
  } catch (error) {
    // A 500 makes Stripe retry, which is what we want for a transient failure.
    console.error(`Webhook handler failed for ${event.type}`, error);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }
}

async function handle(stripe: Stripe, event: Stripe.Event) {
  let subscription: Stripe.Subscription;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription" || !session.subscription) return;

    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } else {
    subscription = event.data.object as Stripe.Subscription;
  }

  await syncSubscription(stripe, subscription);
}

async function syncSubscription(stripe: Stripe, subscription: Stripe.Subscription) {
  const admin = createAdminClient()!;

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const userId = await resolveUserId(stripe, subscription, customerId);
  if (!userId) {
    // Nothing we can do but record it — retrying will not conjure a user.
    console.error(`No Supabase user for Stripe customer ${customerId}; ignoring event.`);
    return;
  }

  const item = subscription.items.data[0];
  const priceId = item?.price.id ?? null;

  // Fall back to the metadata written at checkout when the price ID does not
  // match anything configured — that happens when prices are rotated.
  const plan: Plan =
    (priceId ? planForPriceId(priceId) : null) ??
    (subscription.metadata?.plan as Plan | undefined) ??
    "pro";

  const entitled = ENTITLED_STATUSES.has(subscription.status);

  // The billing period lives on the subscription item in current API versions,
  // not on the subscription itself.
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000).toISOString()
    : null;

  const { error: subscriptionError } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan: entitled ? plan : "free",
      status: subscription.status,
      price_id: priceId,
      billing_interval: item?.price.recurring?.interval ?? null,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    },
    { onConflict: "user_id" }
  );

  if (subscriptionError) throw subscriptionError;

  // profiles.plan is what the rest of the app reads, so it is updated in step.
  const { error: profileError } = await admin
    .from("profiles")
    .update({ plan: entitled ? plan : "free" })
    .eq("id", userId);

  if (profileError) throw profileError;
}

/**
 * Three sources, in order of reliability: the subscription metadata we set at
 * checkout, the customer metadata set when the customer was created, and
 * finally our own table keyed by customer ID.
 */
async function resolveUserId(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  customerId: string
): Promise<string | null> {
  const fromSubscription = subscription.metadata?.supabase_user_id;
  if (fromSubscription) return fromSubscription;

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted && customer.metadata?.supabase_user_id) {
      return customer.metadata.supabase_user_id;
    }
  } catch (error) {
    console.error("Could not retrieve Stripe customer", error);
  }

  const admin = createAdminClient()!;
  const { data } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.user_id ?? null;
}
