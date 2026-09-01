export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  published: string;
  readingMinutes: number;
  intro: string;
  sections: BlogSection[];
  cta: { href: string; label: string };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-create-an-invoice",
    title: "How to Create an Invoice",
    metaTitle: "How to Create an Invoice (Step-by-Step Guide)",
    description:
      "A step-by-step guide to creating an invoice that gets paid: required fields, numbering, dates, tax and payment terms.",
    published: "2026-01-14",
    readingMinutes: 6,
    intro:
      "Creating an invoice is mechanical once you know which fields matter and why. This walks through each one in the order you should fill it in.",
    sections: [
      {
        heading: "Start with who is billing whom",
        paragraphs: [
          "The two identity blocks — yours and the client's — do more work than people expect. Your block establishes who is owed the money and, via your tax number, that you are entitled to charge tax. The client block has to name the legal entity, not the brand. An invoice addressed to a trading name that does not match the entity on the purchase order is one of the most common reasons an invoice is returned unpaid.",
        ],
      },
      {
        heading: "Number it properly",
        paragraphs: [
          "Use a single unbroken sequence: INV-0001, INV-0002, and so on. Do not restart the sequence per client, and do not leave gaps. Gaps look like deleted invoices to an auditor, and sequential numbering is a legal requirement in much of Europe.",
          "If you want client information in the reference, add it as a suffix rather than breaking the sequence — INV-0042-ACME reads fine and still sorts.",
        ],
      },
      {
        heading: "Write line items a stranger can understand",
        paragraphs: [
          "The person who approves your invoice is often not the person who hired you. Write descriptions for them. \"Consulting\" tells an accounts payable clerk nothing; \"Q1 marketing strategy workshop, 2 days, 12–13 March\" can be matched to a purchase order without a phone call.",
        ],
      },
      {
        heading: "Set dates, not shorthand",
        paragraphs: [
          "Net 30 is fine as long as you also print the actual due date. Shorthand gets interpreted differently by different finance teams — some count from receipt, some from month end — and a printed date removes the ambiguity entirely.",
        ],
      },
      {
        heading: "Say how to pay you",
        paragraphs: [
          "Payment details belong on the invoice itself, not in the covering email. Emails get forwarded into ticketing systems that strip attachments and context; the PDF is the document that survives.",
        ],
        list: [
          "Bank name, account number and routing/sort code, or IBAN and BIC",
          "The exact account name so it matches their beneficiary check",
          "A payment reference — usually the invoice number",
          "Any online payment link, if you offer one",
        ],
      },
    ],
    cta: { href: "/invoice-generator", label: "Create your free invoice" },
  },
  {
    slug: "what-should-an-invoice-include",
    title: "What Should an Invoice Include?",
    metaTitle: "What Should an Invoice Include? (Complete Checklist)",
    description:
      "A complete checklist of what an invoice must include, plus the optional fields that get you paid faster.",
    published: "2026-01-21",
    readingMinutes: 5,
    intro:
      "Most invoice disputes come down to a missing field. Here is the full list, split into what is required and what simply works.",
    sections: [
      {
        heading: "The required fields",
        paragraphs: [
          "These appear in the rules of almost every tax jurisdiction. Omitting one can cost your client their tax deduction, which means the invoice comes back to you.",
        ],
        list: [
          "The word \"Invoice\"",
          "A unique sequential invoice number",
          "Your business name, address and contact details",
          "Your tax registration number, where you have one",
          "The customer's legal name and address",
          "The invoice date and the date of supply if they differ",
          "A description, quantity and unit price for each line",
          "The tax rate and tax amount, shown separately",
          "The total amount payable",
        ],
      },
      {
        heading: "The fields that get you paid faster",
        paragraphs: [
          "None of these are mandatory, and all of them shorten payment times in practice.",
        ],
        list: [
          "The client's purchase order number, where they use one",
          "A named contact in their organisation",
          "The specific due date, printed as a date",
          "Bank details on the document itself",
          "A late payment charge, stated before it applies",
        ],
      },
      {
        heading: "What to leave off",
        paragraphs: [
          "Do not put your personal tax identification number on an invoice if a business number is available, and do not include internal cost breakdowns you would not want quoted back to you in a negotiation. An invoice is a document that will be forwarded, filed and read by people you have never met.",
        ],
      },
    ],
    cta: { href: "/invoice-generator", label: "Create your free invoice" },
  },
  {
    slug: "invoice-vs-receipt",
    title: "Invoice vs Receipt: What Is the Difference?",
    metaTitle: "Invoice vs Receipt – What Is the Difference?",
    description:
      "Invoices request payment, receipts confirm it. Here is when to issue each, what they must contain, and why you usually need both.",
    published: "2026-02-04",
    readingMinutes: 4,
    intro:
      "The two documents are constantly confused, and the confusion causes real accounting problems. The distinction is simple: one asks, the other confirms.",
    sections: [
      {
        heading: "The invoice asks for money",
        paragraphs: [
          "An invoice is issued before payment. It creates a receivable in your books and a payable in the client's. Its job is to establish what is owed, by whom, and by when.",
        ],
      },
      {
        heading: "The receipt confirms money arrived",
        paragraphs: [
          "A receipt is issued after payment. It creates nothing; it closes something. Its job is proof — for the buyer claiming an expense, and for you settling any later dispute about whether an amount was paid.",
        ],
      },
      {
        heading: "When you need both",
        paragraphs: [
          "Any time a client pays on terms. The invoice starts the clock, the receipt stops it, and matching the two is how reconciliation works. When a client pays immediately — retail, a deposit taken on the spot — the receipt alone is enough.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Two errors account for most of the trouble: writing \"paid\" on an invoice and treating it as a receipt, which leaves no independent record of the payment date; and issuing a receipt with no reference to the original invoice, which makes reconciliation guesswork six months later.",
        ],
      },
    ],
    cta: { href: "/receipt-generator", label: "Create a free receipt" },
  },
  {
    slug: "invoice-vs-estimate",
    title: "Invoice vs Estimate vs Quote",
    metaTitle: "Invoice vs Estimate vs Quote – Which Should You Send?",
    description:
      "Estimates approximate, quotes commit, invoices bill. Choosing the wrong document can cost you the difference.",
    published: "2026-02-18",
    readingMinutes: 5,
    intro:
      "These three documents describe the same job at three different moments, and using the wrong word at the wrong moment is expensive.",
    sections: [
      {
        heading: "Estimate: an approximation",
        paragraphs: [
          "An estimate is your considered guess before the work is scoped. It is not binding, and a client who receives one understands the final figure may move. State what could change it — that sentence is the whole value of calling it an estimate.",
        ],
      },
      {
        heading: "Quote: a commitment",
        paragraphs: [
          "A quote is a fixed price you are prepared to be held to, usually for a stated period. Once accepted it generally forms a contract on price and scope. That makes the scope wording, not the number, the risky part of the document.",
        ],
      },
      {
        heading: "Invoice: the bill",
        paragraphs: [
          "The invoice comes after the work and creates the debt. It should reference the quote or estimate it follows, so the client can see the agreed figure carried through — and so any variation is visible as its own line rather than an unexplained increase.",
        ],
      },
      {
        heading: "The usual sequence",
        paragraphs: [
          "Estimate or quote, then work, then invoice, then receipt. Skipping the first step is what turns a scope disagreement into a payment dispute.",
        ],
      },
    ],
    cta: { href: "/estimate-generator", label: "Create a free estimate" },
  },
  {
    slug: "how-to-number-invoices",
    title: "How to Number Invoices",
    metaTitle: "How to Number Invoices (Systems That Actually Work)",
    description:
      "Sequential, dated or client-coded? A practical guide to invoice numbering systems and the rules you must not break.",
    published: "2026-03-03",
    readingMinutes: 4,
    intro:
      "Invoice numbering looks trivial until an auditor asks why there is no invoice 47. Here is how to pick a system you can live with.",
    sections: [
      {
        heading: "The two rules",
        paragraphs: [
          "Whatever system you choose, numbers must be unique and the sequence must have no gaps. In many countries both are legal requirements; everywhere they are practical ones, because a gap is indistinguishable from a deleted invoice.",
        ],
      },
      {
        heading: "Three systems that work",
        paragraphs: [
          "Pick one and never change it mid-year.",
        ],
        list: [
          "Simple sequential — INV-0001 onward. Best for most solo businesses.",
          "Year-prefixed — 2026-001, resetting each January. Makes year-end filing easier.",
          "Client-suffixed — INV-0042-ACME. Keeps the global sequence intact while making the client visible.",
        ],
      },
      {
        heading: "What to do about a cancelled invoice",
        paragraphs: [
          "Never delete it and never reuse the number. Issue a credit note against it, or mark it cancelled and keep it in the sequence with a zero value. The gap you avoid creating is worth more than the tidiness you lose.",
        ],
      },
    ],
    cta: { href: "/invoice-generator", label: "Create your free invoice" },
  },
  {
    slug: "how-to-invoice-as-a-freelancer",
    title: "How to Invoice as a Freelancer",
    metaTitle: "How to Invoice as a Freelancer (and Actually Get Paid)",
    description:
      "Practical invoicing advice for freelancers: what to charge for, when to send, how to follow up, and how to prevent late payment.",
    published: "2026-03-17",
    readingMinutes: 7,
    intro:
      "Freelance invoicing is less about the document than the habits around it. Most late payment is designed in at invoice time.",
    sections: [
      {
        heading: "Invoice the day you deliver",
        paragraphs: [
          "The single highest-leverage change most freelancers can make is to stop batching invoices at month end. An invoice sent the day the work lands arrives while the client still remembers approving it, and it starts the payment clock up to four weeks earlier.",
        ],
      },
      {
        heading: "Ask for a deposit",
        paragraphs: [
          "For anything longer than a week or two, a deposit invoice before starting is standard and rarely refused. It covers your exposure, and a client who will not pay a deposit is telling you something useful about how they will treat the final invoice.",
        ],
      },
      {
        heading: "Make the terms specific",
        paragraphs: [
          "Fourteen days is a reasonable default for a solo supplier. Negotiate the terms before the engagement, not after the first invoice goes unpaid — at that point you have no leverage and the conversation is adversarial.",
        ],
      },
      {
        heading: "Follow up on a schedule, not a feeling",
        paragraphs: [
          "Decide the cadence in advance and run it regardless of how awkward it feels, because a predictable process is far easier to sustain than a decision made each time.",
        ],
        list: [
          "Three days before the due date: a short, friendly reminder",
          "On the due date: a note that payment is now due",
          "Seven days overdue: a firmer message referencing your terms",
          "Fourteen days overdue: apply the late fee and escalate to a named finance contact",
        ],
      },
      {
        heading: "Keep everything",
        paragraphs: [
          "Every invoice PDF, every acceptance email, every scope change. It is dull filing that does nothing at all until the one occasion it does everything.",
        ],
      },
    ],
    cta: { href: "/invoice-generator/freelancer", label: "Create a freelancer invoice" },
  },
  {
    slug: "what-is-a-proforma-invoice",
    title: "What Is a Proforma Invoice?",
    metaTitle: "What Is a Proforma Invoice? (And When to Use One)",
    description:
      "A proforma invoice is a preliminary bill sent before delivery. Here is what it is for, what it must contain, and how it differs from a commercial invoice.",
    published: "2026-04-07",
    readingMinutes: 5,
    intro:
      "Proforma invoices are standard in international trade and widely misunderstood everywhere else.",
    sections: [
      {
        heading: "A bill that is not yet a bill",
        paragraphs: [
          "A proforma invoice states what will be supplied and at what price, before the supply happens. It is not a demand for payment in the legal sense, it does not go into your sales ledger, and it cannot be used by the buyer to reclaim tax.",
        ],
      },
      {
        heading: "The three situations it is used in",
        paragraphs: [],
        list: [
          "Cross-border shipments, where customs needs a declared value before goods arrive",
          "New customers required to pay in advance",
          "Corporate procurement, where a document is needed before a purchase order can be raised",
        ],
      },
      {
        heading: "How it differs from a commercial invoice",
        paragraphs: [
          "The commercial invoice is the final, binding document that accompanies the shipment and is used to assess duty. The proforma is provisional and expected to change. Issue the commercial invoice as soon as the goods ship — leaving only a proforma on file is a common cause of customs delay.",
        ],
      },
    ],
    cta: { href: "/proforma-invoice-generator", label: "Create a proforma invoice" },
  },
  {
    slug: "how-long-to-keep-invoices",
    title: "How Long Should You Keep Invoices?",
    metaTitle: "How Long Should You Keep Invoices? (By Country)",
    description:
      "Retention periods for invoices in the US, UK, EU, Canada and Australia, and what format you need to keep them in.",
    published: "2026-04-28",
    readingMinutes: 4,
    intro:
      "Retention periods vary by country and are longer than most people assume. When in doubt, keep everything for ten years.",
    sections: [
      {
        heading: "Typical retention periods",
        paragraphs: [
          "These are the common baselines. Specific circumstances — an open audit, a property transaction, a loss carried forward — can extend them considerably.",
        ],
        list: [
          "United States: at least three years, seven if a loss or bad debt is claimed",
          "United Kingdom: six years for VAT records",
          "Germany: ten years from the end of the year of issue",
          "France: ten years for accounting records",
          "Canada: six years from the end of the tax year",
          "Australia: five years from when the record was prepared",
        ],
      },
      {
        heading: "Digital copies count",
        paragraphs: [
          "Every jurisdiction listed above accepts digital records, provided they are complete, unaltered and readable for the whole retention period. That last condition is the one that catches people — a proprietary accounting format you can no longer open is not a kept record.",
          "PDFs are the safe choice, backed up somewhere other than the machine that created them.",
        ],
      },
      {
        heading: "Keep the document, not just the entry",
        paragraphs: [
          "A ledger line saying you invoiced a client for a sum is not the same as the invoice. Tax authorities ask for the document, because the document is what shows the description, the tax treatment and the date of supply.",
        ],
      },
    ],
    cta: { href: "/invoice-generator", label: "Create your free invoice" },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
