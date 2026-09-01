import type { ContentSection } from "@/components/GeneratorPage";
import type { FaqItem } from "@/lib/seo";

export interface ProfessionPage {
  slug: string;
  name: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  templateId: string;
  /** Line items pre-populated for this trade — the reason the page is not a clone. */
  sections: ContentSection[];
  faq: FaqItem[];
}

export const PROFESSION_PAGES: ProfessionPage[] = [
  {
    slug: "freelancer",
    name: "Freelancers",
    title: "Free Invoice Generator for Freelancers – PDF Invoices",
    h1: "Invoice Generator for Freelancers",
    description:
      "Free invoice generator built for freelancers. Bill by the hour or by project, add your logo, and download a PDF invoice in seconds.",
    intro:
      "Bill by the hour, by the day or by the project. Add your details once and the invoice writes itself.",
    templateId: "freelance",
    sections: [
      {
        heading: "How freelancers should structure an invoice",
        paragraphs: [
          "The line item is where freelance invoices go wrong. A single line reading \"Design work — $3,000\" invites the client to question the whole figure. Splitting the same job into four lines with hours or deliverables against each turns the conversation from \"is this worth $3,000\" into \"which of these four things do we want\".",
          "If you bill hourly, put the rate in the unit price and the hours in quantity, so the client can see the arithmetic. If you bill by deliverable, put the deliverable in the description and leave quantity at one.",
        ],
      },
      {
        heading: "Getting paid on time as a freelancer",
        paragraphs: [
          "Late payment is the defining problem of freelance work, and most of it is preventable at invoice time rather than at chase time.",
        ],
        list: [
          "Invoice the day the work is delivered, not at month end",
          "Put a specific due date on the invoice, not \"net 30\"",
          "Include your bank details or payment link on the document itself",
          "Ask for a deposit on any project over a couple of weeks long",
          "Agree a late fee in writing before you start, then actually apply it",
        ],
      },
      {
        heading: "Tax as a self-employed freelancer",
        paragraphs: [
          "You are responsible for setting aside your own tax, and in most countries for a self-employment or social contribution on top of income tax. A common rule of thumb is to move 25–30% of every payment into a separate account the day it lands.",
          "Keep every invoice you issue. In an audit the invoice, not the bank statement, is what establishes what the payment was for.",
        ],
      },
    ],
    faq: [
      {
        question: "Do freelancers need to charge tax?",
        answer:
          "It depends on your country and your turnover. Many jurisdictions have a registration threshold below which you charge no sales tax or VAT at all. Above it, registration is usually mandatory.",
      },
      {
        question: "Should I invoice per project or per hour?",
        answer:
          "Hourly protects you on open-ended work; fixed price rewards you for being fast. Whichever you choose, itemise on the invoice so the client can see what they are paying for.",
      },
      {
        question: "What payment terms should a freelancer use?",
        answer:
          "Fourteen days is a reasonable default for a solo supplier. Thirty days is common with larger companies, but ask for shorter terms before you sign, not after the first invoice is late.",
      },
    ],
  },
  {
    slug: "consultant",
    name: "Consultants",
    title: "Free Invoice Generator for Consultants – PDF Invoices",
    h1: "Invoice Generator for Consultants",
    description:
      "Professional invoice generator for consultants. Bill retainers, day rates and expenses on one document and download it as a PDF.",
    intro:
      "Retainers, day rates and pass-through expenses on one clean, professional document.",
    templateId: "professional",
    sections: [
      {
        heading: "Billing a retainer",
        paragraphs: [
          "A retainer invoice should say what period it covers and what it entitles the client to. \"Advisory retainer — March 2026, up to 8 days\" is unambiguous; \"Consulting\" is the line that ends up in a dispute six months later.",
          "Where the retainer includes a capped number of days, add a second line for days used beyond the cap at your overage rate. Showing zero overage is itself a useful signal to the client.",
        ],
      },
      {
        heading: "Recharging expenses",
        paragraphs: [
          "Expenses recharged to a client normally sit on the invoice as separate lines from your fees, because they are often taxed differently and are almost always scrutinised more closely.",
        ],
        list: [
          "Travel and accommodation, listed by trip rather than as a lump sum",
          "Third-party costs paid on the client's behalf",
          "Software or data purchased specifically for the engagement",
          "Anything you agreed in advance to recharge at cost — say so on the line",
        ],
      },
      {
        heading: "Day rates and part days",
        paragraphs: [
          "Decide in advance how you handle a half day and put it in the engagement letter. On the invoice, express part days as a decimal quantity against your day rate rather than inventing a separate half-day price, so the rate on the document stays consistent across every invoice you issue.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I invoice for a retainer?",
        answer:
          "Issue it at the start of the period it covers, name the period explicitly, and state what is included. Most consultants bill retainers in advance and overage in arrears.",
      },
      {
        question: "Should expenses go on the same invoice as fees?",
        answer:
          "Usually yes, but as separate lines. Some clients require expenses on a separate invoice with receipts attached — ask before the first billing cycle rather than after.",
      },
      {
        question: "What should a consulting invoice description say?",
        answer:
          "Enough that someone in accounts payable who has never met you can match it to a purchase order: the engagement name, the period, and the basis of the charge.",
      },
    ],
  },
  {
    slug: "photographer",
    name: "Photographers",
    title: "Free Invoice Generator for Photographers – PDF Invoices",
    h1: "Invoice Generator for Photographers",
    description:
      "Invoice generator for photographers. Bill shoot fees, licensing, editing and travel, and download a branded PDF invoice for free.",
    intro:
      "Shoot fee, licensing, editing time and travel — itemised the way photography clients expect to see it.",
    templateId: "modern",
    sections: [
      {
        heading: "Separating the shoot fee from the licence",
        paragraphs: [
          "The most valuable habit in photography invoicing is splitting the day rate from the usage licence. They are different things: one pays for your time, the other pays for the right to use the images in a defined way, for a defined period, in a defined territory.",
          "Keeping them on separate lines means that when the client later wants wider usage, you have an existing line to extend rather than a renegotiation of your whole fee.",
        ],
      },
      {
        heading: "What to itemise on a photography invoice",
        paragraphs: [
          "A typical commercial shoot breaks into five or six lines.",
        ],
        list: [
          "Shoot fee, by day or half day",
          "Usage licence — medium, territory and duration stated on the line",
          "Post-production and retouching, by hour or by image",
          "Assistant, studio hire or equipment rental",
          "Travel and subsistence",
          "Rush surcharge where the turnaround was compressed",
        ],
      },
      {
        heading: "Deposits and cancellation",
        paragraphs: [
          "A booking deposit protects a date you cannot resell at short notice. Invoice it on booking, state on the invoice that it is non-refundable within a stated window, and deduct it as a line on the final invoice so the client can see it applied.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I invoice for image licensing?",
        answer:
          "Put the licence on its own line and describe its limits — for example \"Web and social use, worldwide, 12 months from delivery\". Vague licence wording is the main cause of unpaid usage extensions.",
      },
      {
        question: "Should I charge for editing separately?",
        answer:
          "If retouching time varies by job, yes. Bundling it into a day rate means you absorb the cost on the jobs that need most work.",
      },
      {
        question: "When should a photographer invoice a client?",
        answer:
          "Deposit on booking, balance on delivery of the finished images. Withholding high-resolution files until the balance clears is a widely accepted practice — state it on the invoice.",
      },
    ],
  },
  {
    slug: "web-developer",
    name: "Web developers",
    title: "Free Invoice Generator for Web Developers – PDF Invoices",
    h1: "Invoice Generator for Web Developers",
    description:
      "Invoice generator for web developers and software freelancers. Bill sprints, milestones, hosting and maintenance on one PDF invoice.",
    intro:
      "Milestones, sprints, hosting and maintenance — billed on one document your client's finance team can process.",
    templateId: "modern",
    sections: [
      {
        heading: "Milestone billing versus hourly",
        paragraphs: [
          "Development work is usually billed one of three ways: hourly against a tracked log, per sprint at a fixed rate, or against milestones tied to deliverables. Milestone billing is the friendliest to clients because it maps spend to visible progress, and the friendliest to you because it front-loads cash.",
          "Whichever you use, the invoice line should reference something the client can verify — a sprint number, a milestone name from the statement of work, or a date range from your time log.",
        ],
      },
      {
        heading: "Recurring lines developers forget to bill",
        paragraphs: [
          "The one-off build is the visible revenue; the recurring lines are the ones that quietly go unbilled for months.",
        ],
        list: [
          "Hosting and domain renewals paid on the client's behalf",
          "Third-party licences — plugins, APIs, monitoring, error tracking",
          "Monthly maintenance and dependency updates",
          "Support hours outside the agreed retainer",
          "Post-launch changes that were never scoped",
        ],
      },
      {
        heading: "Handling scope changes on an invoice",
        paragraphs: [
          "Bill change requests as their own lines, referencing the request, rather than absorbing them into the milestone. It costs nothing to be explicit, and it produces a paper trail showing exactly why the project cost more than the original quote.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I bill a deposit before starting development?",
        answer:
          "For most projects, yes — commonly 30–50% on signing. It covers the discovery work that happens before anything visible exists.",
      },
      {
        question: "How do I invoice for maintenance?",
        answer:
          "A fixed monthly line with a stated inclusion, such as updates, backups and up to two hours of changes, plus a separate line for hours beyond that.",
      },
      {
        question: "Can I invoice a client in another currency?",
        answer:
          "Yes — pick the currency in the editor. Agree who absorbs conversion fees before the first invoice, and state it in the payment terms.",
      },
    ],
  },
  {
    slug: "graphic-designer",
    name: "Graphic designers",
    title: "Free Invoice Generator for Graphic Designers – PDF Invoices",
    h1: "Invoice Generator for Graphic Designers",
    description:
      "Invoice generator for graphic designers. Bill concepts, revisions, artwork files and usage rights, and download a free PDF invoice.",
    intro:
      "Concepts, revision rounds, final artwork and transfer of rights — each on its own line.",
    templateId: "minimal",
    sections: [
      {
        heading: "Billing revisions properly",
        paragraphs: [
          "Unlimited revisions is the fastest way for a profitable design job to become an unprofitable one. Quote a number of rounds, then bill additional rounds as separate invoice lines at a stated rate. Showing \"Revision round 3 (beyond the two included)\" on the invoice is far easier than raising it in conversation.",
        ],
      },
      {
        heading: "What a design invoice should itemise",
        paragraphs: [
          "Design invoices are read by marketing managers, not accountants, so the descriptions should reflect the process the client experienced.",
        ],
        list: [
          "Discovery and concept development",
          "Design of each named deliverable",
          "Included revision rounds, then additional rounds as separate lines",
          "Final artwork preparation and file handover",
          "Transfer or licence of usage rights",
          "Stock imagery, fonts and print costs paid on the client's behalf",
        ],
      },
      {
        heading: "Ownership and the final invoice",
        paragraphs: [
          "In many jurisdictions copyright in a design stays with the designer unless it is assigned in writing. Making assignment conditional on full payment — and saying so on the invoice — gives you real leverage on a late-paying client, which a generic payment reminder does not.",
        ],
      },
    ],
    faq: [
      {
        question: "How much should I charge for a logo?",
        answer:
          "It varies enormously by market and by usage. What matters on the invoice is that the price is tied to a defined deliverable and a defined licence, so the figure has visible logic behind it.",
      },
      {
        question: "Should I invoice before handing over source files?",
        answer:
          "Common practice is to deliver previews on approval and release source files and the rights assignment on payment. State it in the payment terms.",
      },
      {
        question: "How do I bill for stock images bought for a client?",
        answer:
          "As a separate line at cost, or at cost plus an agreed handling percentage. Keep the receipts — clients often ask.",
      },
    ],
  },
  {
    slug: "contractor",
    name: "Contractors",
    title: "Free Invoice Generator for Contractors – PDF Invoices",
    h1: "Invoice Generator for Contractors",
    description:
      "Invoice generator for contractors and tradespeople. Bill labour, materials and call-out charges, and download a free PDF invoice.",
    intro:
      "Labour, materials, plant hire and call-out charges — itemised on a document that stands up on site.",
    templateId: "classic",
    sections: [
      {
        heading: "Separating labour from materials",
        paragraphs: [
          "Trade invoices should always split labour from materials. Clients scrutinise material costs and accept labour rates, and in several countries the two are taxed differently or attract different reporting requirements on construction work.",
          "Where you have marked materials up, say so as a stated percentage rather than burying it in the unit price. Clients who find a hidden markup rarely call you back.",
        ],
      },
      {
        heading: "Staged payments on longer jobs",
        paragraphs: [
          "Anything longer than a couple of weeks should be invoiced in stages so you are never financing the client's project out of your own working capital.",
        ],
        list: [
          "Deposit on acceptance, typically covering materials",
          "Interim invoices at agreed milestones or monthly",
          "A final invoice on completion and sign-off",
          "Retention, where the contract holds back a percentage until the defects period ends",
        ],
      },
      {
        heading: "Variations and extras",
        paragraphs: [
          "Extras agreed verbally on site are the single most common source of unpaid trade work. Give every variation a number, note it on the invoice as its own line referencing the date it was agreed, and the argument disappears.",
        ],
      },
    ],
    faq: [
      {
        question: "Should a contractor invoice include a call-out fee?",
        answer:
          "If you charge one, put it on its own line rather than folding it into the first hour of labour, so the client can see what it covers.",
      },
      {
        question: "How do I handle retention on an invoice?",
        answer:
          "Invoice the full value, then show the retained percentage as a discount line, and issue a separate invoice for the retention when the defects period ends.",
      },
      {
        question: "Do I need to show my licence number?",
        answer:
          "In many regions a trade licence or registration number must appear on the invoice. Use the Tax ID field for it if it is required alongside your tax number.",
      },
    ],
  },
  {
    slug: "writer",
    name: "Writers",
    title: "Free Invoice Generator for Writers – PDF Invoices",
    h1: "Invoice Generator for Writers",
    description:
      "Invoice generator for freelance writers, copywriters and editors. Bill per word, per piece or per hour and download a PDF invoice free.",
    intro:
      "Per word, per piece or per hour — plus kill fees and rights, on a document editors can process.",
    templateId: "minimal",
    sections: [
      {
        heading: "Billing per word, per piece or per hour",
        paragraphs: [
          "Per-word rates are conventional in journalism, per-piece in content marketing, and hourly in editing. The invoice should make the basis obvious: put the rate in unit price and the word count or hours in quantity, so an editor checking against a commission can reconcile in seconds.",
          "Where a piece ran shorter than commissioned, bill the commissioned length unless you agreed otherwise. Where it ran longer at the editor's request, bill the actual length and say so in the description.",
        ],
      },
      {
        heading: "Kill fees and rights",
        paragraphs: [
          "Two lines that belong on a writer's invoice and are routinely left off.",
        ],
        list: [
          "Kill fee — the agreed percentage payable when a commissioned piece is not run",
          "Rights granted — first serial, exclusive for a period, or all rights",
          "Syndication or reprint fees where the piece is reused",
          "Research or interview time billed separately from drafting",
        ],
      },
      {
        heading: "Invoicing publications",
        paragraphs: [
          "Publications almost always pay against a purchase order number and on fixed monthly cycles. Ask for the PO number when the piece is commissioned and put it in the invoice number field or the notes — an invoice without it will usually sit unpaid without anyone telling you why.",
        ],
      },
    ],
    faq: [
      {
        question: "When should a freelance writer invoice?",
        answer:
          "On submission or on acceptance, according to the commissioning terms. Do not wait for publication — publication dates slip, and payment terms usually run from the invoice, not the issue date.",
      },
      {
        question: "What is a kill fee?",
        answer:
          "An agreed percentage of the full fee, commonly 25–50%, payable when a commissioned piece is not published. Invoice it as its own line, referencing the commission.",
      },
      {
        question: "Should I charge for research time?",
        answer:
          "If the piece required substantial interviews or travel, bill it separately rather than absorbing it into a per-word rate that assumes desk research.",
      },
    ],
  },
];

export function getProfessionPage(slug: string): ProfessionPage | undefined {
  return PROFESSION_PAGES.find((page) => page.slug === slug);
}
