# InvoiceFlowGenerator

A free invoice generator: fill in a form, watch an A4 document build itself in a live preview,
and download a real PDF. Built with Next.js 15 (App Router), TypeScript, Tailwind v4,
`@react-pdf/renderer` for the PDF, and Supabase for optional accounts.

## Running it

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Open <http://localhost:3000>. **Nothing in `.env.local` is required** to create invoices and
download PDFs; the generator, all landing pages and the blog work with no backend at all.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_SUPABASE_URL` | Accounts, saving invoices, dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console verification meta tag |
| `ANTHROPIC_API_KEY` | The AI tools at `/dashboard/ai` |
| `AI_REQUIRE_PRO` | Set `true` to gate the AI tools behind a paid plan (default `false`) |
| `STRIPE_SECRET_KEY` | Subscriptions |
| `STRIPE_WEBHOOK_SECRET` | Verifying webhook payloads |
| `STRIPE_PRICE_{PRO,BUSINESS}_{MONTH,YEAR}` | The four Stripe price IDs |
| `SUPABASE_SECRET_KEY` | Server only — the webhook writes with it. Never expose it. |

When `ANTHROPIC_API_KEY` is absent, `/dashboard/ai` renders an explanatory notice and
`/api/ai` returns 501. When the Supabase variables are absent, `/login` and `/dashboard` render an explanatory notice,
the editor shows "Sign in to save" instead of a Save button, and `/api/invoices` returns 501.
Every other route behaves normally.

When Stripe is unset, `/pricing` renders the plans with a disabled "Coming soon" button and
every `/api/stripe/*` route returns 501.

## Stripe setup

1. In the Stripe dashboard, create two **recurring** products — Pro and Business — each with a
   monthly and a yearly price. Four price IDs in total (`price_...`).
2. Put them in `STRIPE_PRICE_PRO_MONTH`, `STRIPE_PRICE_PRO_YEAR`, `STRIPE_PRICE_BUSINESS_MONTH`
   and `STRIPE_PRICE_BUSINESS_YEAR`. A plan with no price ID shows as "Coming soon" rather than
   breaking.
3. Run `database/migrations/001_stripe.sql` in the Supabase SQL editor.
4. Copy a Supabase **secret** key into `SUPABASE_SECRET_KEY`. The webhook arrives with no user
   session, so it needs to bypass RLS to write the subscription row.
5. Add a webhook endpoint at `<your-site>/api/stripe/webhook` subscribed to
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`
   and `customer.subscription.deleted`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
6. Enable the customer portal under Stripe → Settings → Billing → Customer portal, or the
   Manage billing button will fail.

Locally, forward events with the Stripe CLI instead of step 5:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### How entitlement works

`profiles.plan` is the single field the rest of the app reads. Only the webhook writes it, using
the service-role key, and only from a payload whose Stripe signature verified. A subscription in
any status other than `active` or `trialing` sets the plan back to `free`, so a failed renewal
downgrades on its own. The browser never writes the plan — users change it through Stripe's
portal.

## Supabase setup

1. Create a project.
2. Run `database/schema.sql` in the SQL editor. It creates the tables, enables row level
   security on all of them, and adds owner-only policies.
3. In Authentication → Providers, enable Email (magic link) and Google.
4. Add `<your-site>/auth/callback` to the allowed redirect URLs.

## How it is put together

```
app/
  page.tsx                        landing page
  invoice-generator/              plus 8 sibling tool pages, all data-driven
  invoice-generator/[profession]/ 7 trade-specific pages
  templates/, templates/[slug]/   template gallery and per-template editors
  us-invoice/ uk-invoice/ ...     6 country pages with their own tax copy
  blog/, blog/[slug]/             8 guides
  api/pdf/                        POST invoice JSON, get a PDF back
  api/invoices/                   save and list (requires auth)
  api/ai/                         the five AI tools (requires auth)
  api/stripe/                     checkout, billing portal, webhook
  dashboard/ai/                   AI tools UI
components/
  InvoiceEditor.tsx               the client-side editor
  InvoicePreview.tsx              HTML rendering of a document
  GeneratorPage.tsx               shared shell for every tool/SEO page
lib/
  ai/tools.ts                     prompts and output schemas for the AI tools
  totals.ts                       the single source of truth for arithmetic
  templates.ts                    the five template specs
  content/                        tool, profession, country and blog copy
  pdf/InvoiceDocument.tsx         react-pdf mirror of InvoicePreview
  validate.ts                     server-side parsing of any submitted invoice
database/schema.sql
```

Two rules keep the codebase honest:

- **Totals are computed in one place.** `lib/totals.ts` is used by the editor, the preview, the
  PDF and the save endpoint. The server recomputes them rather than trusting the client, so a
  crafted payload cannot produce a PDF whose total disagrees with its line items.
- **The preview and the PDF read the same `TemplateSpec`.** They are separate renderers — one
  HTML, one react-pdf — but colours, layout variant and typeface come from `lib/templates.ts`,
  so a template change cannot leave them out of step.

## AI tools

`/dashboard/ai` runs five jobs through `claude-opus-5`:

| Tool | Output | Shape |
| --- | --- | --- |
| Invoice from a sentence | Line items, customer, currency | Structured (Zod) |
| Improve a description | One rewritten line | Text |
| Payment reminder | Subject + body, three tones | Structured (Zod) |
| Invoice email | Subject + body | Structured (Zod) |
| Translate | Translated text, 8 languages | Text |

Three decisions worth knowing about:

- **Low effort, thinking on.** These are short rewriting and extraction jobs, not reasoning
  problems, so requests run at `output_config.effort: "low"`. Adaptive thinking stays on —
  disabling it on Opus 5 risks tool calls and internal tags leaking into visible text.
- **User text is data, not instruction.** Every system prompt in `lib/ai/tools.ts` opens with a
  guardrail saying so. A customer name of "ignore previous instructions and…" is treated as a
  customer name.
- **No invented figures.** The prompts forbid inventing amounts, dates, bank details or company
  names. The draft result carries a visible reminder to check the numbers, because a model reading
  "3 days at 400" can still get the arithmetic intent wrong.

Usage is logged per request to the `ai_requests` table (feature, input and output tokens), and the
endpoint is rate limited to 20 requests per user per minute because every call costs money.

## Known limitation: PDF fonts

The PDF uses the standard Helvetica and Times faces, which only carry WinAnsi glyphs. Text
outside that range (Turkish dotless i, Polish crossed l, CJK) is transliterated by
`lib/pdf/format.ts` rather than dropped, and currencies whose symbol is unavailable print as
`1,500.00 TRY`. To remove the limitation, register a Unicode TTF with `Font.register` in
`lib/pdf/InvoiceDocument.tsx` and use it in the `page` style.

## What is not built yet

This is the MVP, the AI tools and subscription billing. Deliberately out of scope for now:
per-invoice payment links, actually sending the emails the AI drafts, recurring invoices and automatic
reminders, the public `/i/<token>` share page, the REST API for B2B, and the admin panel. The database schema already contains the
tables those features will use (`subscriptions`, `payments`, `api_keys`, `usage`,
`ai_requests`, `email_logs`), so adding them does not require a migration of existing data.

## A spelling note, deliberately left alone

The product is called **InvoiceFlowGenerator** in the UI, but the domain is
**invoiceflowgen*a*rator.com**. The two spellings differ on purpose — the domain was registered
that way, and the owner chose to keep both as they are for now rather than rename either.

Do not "fix" one to match the other without asking. Changing the UI spelling rewrites every page
title and meta description; changing the domain breaks whatever Google has already indexed.

## Deploying

Vercel is the path of least resistance for a Next.js App Router app: the PDF route needs the
Node runtime and everything else is static or server-rendered, which its defaults already handle.

1. Push this repository to GitHub, then import it at vercel.com/new.
2. Framework preset is detected as Next.js. Leave the build command and output directory alone.
3. Add the environment variables below under Settings → Environment Variables (Production).
4. Deploy, then point your domain at it under Settings → Domains.

### Production environment variables

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://invoiceflowgenarator.com` — no trailing slash |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The publishable key |
| `SUPABASE_SECRET_KEY` | The secret key. Production scope only. |
| `STRIPE_SECRET_KEY` | Live mode key once you have tested in test mode |
| `STRIPE_WEBHOOK_SECRET` | From the live-mode webhook endpoint |
| `STRIPE_PRICE_*` | The four live-mode price IDs |
| `NEXT_PUBLIC_GA_ID` | Optional |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional |
| `ANTHROPIC_API_KEY` | Optional — the AI tools stay disabled without it |

### After the first deploy

These are easy to forget and each one breaks something quietly:

- **Supabase → Authentication → URL Configuration**: set Site URL to `https://invoiceflowgenarator.com` and add
  `https://invoiceflowgenarator.com/auth/callback` to the redirect list, or sign-in links will point at
  localhost.
- **Stripe → Webhooks**: add `https://invoiceflowgenarator.com/api/stripe/webhook` in *live* mode and copy
  its signing secret. A test-mode secret will reject live events.
- **Supabase → Authentication → Emails → SMTP**: the built-in mail service is capped at a few
  messages per hour and is not usable for real signups. Point it at Resend, Postmark or similar.
- **Search Console**: submit `https://invoiceflowgenarator.com/sitemap.xml`.
- Check `https://invoiceflowgenarator.com/robots.txt` resolves and that `NEXT_PUBLIC_SITE_URL` made it into
  the canonical tags — a wrong value here silently ruins the SEO work.

### Test mode first

Run the whole checkout flow in Stripe test mode against the production deployment before
switching the keys to live. Card `4242 4242 4242 4242`, any future expiry, any CVC. Verify that
`profiles.plan` flips to `pro` in Supabase and that cancelling in the billing portal flips it
back to `free`.

## Scripts

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```
