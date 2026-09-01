-- Stripe billing — run this after database/schema.sql.
--
-- Safe to run more than once. It adds the columns the webhook writes and an
-- index for the customer lookup it does on every event.

alter table public.subscriptions
  add column if not exists price_id text,
  add column if not exists billing_interval text,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists canceled_at timestamptz;

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

create unique index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- The webhook writes with the service-role key and so bypasses RLS. The owner
-- policy from schema.sql still governs everything the browser does, which is
-- read-only in practice: users change their plan through Stripe's portal, not
-- by writing to this table.
