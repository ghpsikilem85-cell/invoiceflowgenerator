-- InvoiceFlow — Supabase / PostgreSQL schema
--
-- Run this in the Supabase SQL editor. It creates the MVP tables, enables row
-- level security on every one of them, and adds policies so a signed-in user
-- can only ever reach their own rows.
--
-- Tables beyond the MVP (subscriptions, payments, api_keys, usage, ai_requests,
-- email_logs) are created here too so the shape is settled early, but nothing
-- in the application writes to them yet.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth.users row.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Businesses and customers
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  tax_id text not null default '',
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_user_id_idx on public.businesses (user_id);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null default '',
  address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_user_id_idx on public.customers (user_id);

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete set null,
  customer_id uuid references public.customers (id) on delete set null,

  kind text not null default 'invoice'
    check (kind in ('invoice', 'receipt', 'estimate', 'quote', 'proforma')),
  invoice_number text not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue')),

  -- Denormalised issuer/customer details so a saved document never changes
  -- retroactively when the business profile is edited later.
  business_name text not null default '',
  business_email text not null default '',
  business_address text not null default '',
  business_phone text not null default '',
  business_tax_id text not null default '',
  business_logo text,

  customer_name text not null default '',
  customer_email text not null default '',
  customer_address text not null default '',

  currency text not null default 'USD',
  subtotal numeric(14, 2) not null default 0,
  discount numeric(14, 2) not null default 0,
  discount_type text not null default 'percent' check (discount_type in ('percent', 'fixed')),
  discount_value numeric(14, 2) not null default 0,
  tax numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,

  invoice_date date,
  due_date date,

  notes text not null default '',
  payment_terms text not null default '',
  template_id text not null default 'modern',

  -- Public share token for /i/<token>; null until the user shares the invoice.
  share_token text unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_user_id_created_at_idx
  on public.invoices (user_id, created_at desc);
create unique index if not exists invoices_user_number_idx
  on public.invoices (user_id, invoice_number);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  position integer not null default 0,
  description text not null default '',
  quantity numeric(14, 4) not null default 0,
  unit_price numeric(14, 2) not null default 0,
  tax_rate numeric(6, 3) not null default 0,
  total numeric(14, 2) not null default 0
);

create index if not exists invoice_items_invoice_id_idx on public.invoice_items (invoice_id);

-- ---------------------------------------------------------------------------
-- Billing, API and usage — created now, used from V2 onward.
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  invoice_id uuid references public.invoices (id) on delete set null,
  stripe_payment_intent_id text,
  amount numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Default',
  -- Only the hash is stored; the plaintext key is shown once at creation.
  key_hash text not null unique,
  key_prefix text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  period date not null,
  invoices_created integer not null default 0,
  pdfs_generated integer not null default 0,
  api_calls integer not null default 0,
  unique (user_id, period)
);

create table if not exists public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  feature text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  invoice_id uuid references public.invoices (id) on delete set null,
  recipient text not null,
  subject text not null default '',
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.businesses     enable row level security;
alter table public.customers      enable row level security;
alter table public.invoices       enable row level security;
alter table public.invoice_items  enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.payments       enable row level security;
alter table public.api_keys       enable row level security;
alter table public.usage          enable row level security;
alter table public.ai_requests    enable row level security;
alter table public.email_logs     enable row level security;

drop policy if exists "profiles are self-service" on public.profiles;
create policy "profiles are self-service" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- One owner-only policy per user-scoped table.
do $$
declare
  target text;
begin
  foreach target in array array[
    'businesses', 'customers', 'invoices', 'subscriptions',
    'payments', 'api_keys', 'usage', 'ai_requests', 'email_logs'
  ]
  loop
    execute format('drop policy if exists "owner access" on public.%I', target);
    execute format(
      'create policy "owner access" on public.%I for all
         using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      target
    );
  end loop;
end $$;

-- Items are reached through their parent invoice.
drop policy if exists "owner access via invoice" on public.invoice_items;
create policy "owner access via invoice" on public.invoice_items
  for all
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_items.invoice_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_items.invoice_id and i.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  target text;
begin
  foreach target in array array[
    'profiles', 'businesses', 'customers', 'invoices', 'subscriptions'
  ]
  loop
    execute format('drop trigger if exists touch_updated_at on public.%I', target);
    execute format(
      'create trigger touch_updated_at before update on public.%I
         for each row execute function public.touch_updated_at()',
      target
    );
  end loop;
end $$;
