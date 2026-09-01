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

When `ANTHROPIC_API_KEY` is absent, `/dashboard/ai` renders an explanatory notice and
`/api/ai` returns 501. When the Supabase variables are absent, `/login` and `/dashboard` render an explanatory notice,
the editor shows "Sign in to save" instead of a Save button, and `/api/invoices` returns 501.
Every other route behaves normally.

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

This is the MVP plus the AI tools. Deliberately out of scope for now: Stripe subscriptions and
payment links, actually sending the emails the AI drafts, recurring invoices and automatic
reminders, the public `/i/<token>` share page, the REST API for B2B, and the admin panel. The database schema already contains the
tables those features will use (`subscriptions`, `payments`, `api_keys`, `usage`,
`ai_requests`, `email_logs`), so adding them does not require a migration of existing data.

## Scripts

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```
