import type { ContentSection } from "@/components/GeneratorPage";
import type { FaqItem } from "@/lib/seo";
import type { DocumentKind } from "@/types/invoice";

export interface ToolPage {
  slug: string;
  path: string;
  kind: DocumentKind;
  title: string;
  h1: string;
  description: string;
  intro: string;
  bullets: string[];
  currency?: string;
  templateId?: string;
  sections: ContentSection[];
  faq: FaqItem[];
  related: { href: string; label: string }[];
}

const COMMON_BULLETS = [
  "No registration required",
  "Free PDF download",
  "Multiple currencies",
];

export const TOOL_PAGES: ToolPage[] = [
  {
    slug: "invoice-generator",
    path: "/invoice-generator",
    kind: "invoice",
    title: "Free Invoice Generator – Create PDF Invoices Online",
    h1: "Free Invoice Generator",
    description:
      "Create professional invoices online for free. Download PDF invoices instantly with no registration required.",
    intro:
      "Fill in your details and watch the invoice build itself in the live preview. When it looks right, download a print-ready PDF.",
    bullets: COMMON_BULLETS,
    sections: [
      {
        heading: "What is an invoice?",
        paragraphs: [
          "An invoice is a document a seller issues to a buyer that lists what was supplied, what it cost, and when payment is due. It is the record that turns finished work into an enforceable debt, and it is what your accountant and the tax office will ask for at year end.",
          "An invoice is different from a receipt. The invoice asks for money; the receipt confirms money arrived. It is also different from an estimate or a quote, which describe work that has not happened yet and carry no obligation to pay.",
        ],
      },
      {
        heading: "How to create an invoice",
        paragraphs: [
          "The whole process takes about two minutes in the tool above.",
        ],
        orderedList: [
          "Enter your business name, address and tax number so the client knows who to pay.",
          "Add the customer's name, address and billing email.",
          "Give the invoice a unique number and set the issue and due dates.",
          "List each line of work with a description, quantity, unit price and tax rate.",
          "Apply any discount, pick a currency, and choose a template.",
          "Download the PDF and send it to your client.",
        ],
      },
      {
        heading: "What should an invoice include?",
        paragraphs: [
          "Most tax authorities expect the same core fields, whatever country you are in. Leaving one out is the most common reason an invoice gets bounced back by a client's accounts payable team.",
        ],
        list: [
          "The word \"Invoice\" so it is not mistaken for a quote",
          "A unique, sequential invoice number",
          "Your business name, address and contact details",
          "Your tax registration number where you have one",
          "The customer's name and address",
          "The invoice date and the payment due date",
          "A line-by-line description of goods or services",
          "Quantity, unit price and line total for each item",
          "Subtotal, tax, any discount, and the amount due",
          "Payment terms and how to pay you",
        ],
      },
      {
        heading: "Invoice vs receipt",
        paragraphs: [
          "An invoice is a request for payment issued before money changes hands. A receipt is proof of payment issued after. If a client pays you on the spot, you can skip the invoice and issue a receipt instead — but if you want to be paid on terms, you need the invoice first.",
          "Keep both. The invoice supports your revenue figure; the receipt closes the loop and settles disputes about whether an amount was paid.",
        ],
      },
      {
        heading: "Invoice vs estimate",
        paragraphs: [
          "An estimate is your best guess at the cost of work that has not started. It is not binding and it does not create a debt. A quote is a firmer version of the same thing — a fixed price, usually valid for a stated period.",
          "The usual sequence is estimate or quote first, work second, invoice third, receipt last. Our estimate generator and quote generator produce documents that carry over cleanly into an invoice.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this invoice generator really free?",
        answer:
          "Yes. Creating invoices and downloading PDFs is free and unlimited, with no account required. A paid plan exists for saving unlimited invoices, extra templates and automation, but nothing on this page is behind it.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No. The generator runs in your browser and your draft is stored locally on your own device. You only need an account if you want invoices saved to a dashboard you can reach from another computer.",
      },
      {
        question: "Where is my invoice data stored?",
        answer:
          "Your working draft stays in your browser's local storage. The PDF is rendered on our server from the data you submit and is not retained after the file is returned to you.",
      },
      {
        question: "Can I add my own logo?",
        answer:
          "Yes. Upload a PNG or JPG up to 2 MB and it is placed in the invoice header. The logo travels with the PDF, so your client sees your branding.",
      },
      {
        question: "Can I invoice in a different currency?",
        answer:
          "Yes. Pick from 16 currencies including USD, EUR, GBP, CAD, AUD, INR and TRY. Amounts are formatted using the conventions of that currency.",
      },
      {
        question: "How do I number my invoices?",
        answer:
          "Use a sequence with no gaps, such as INV-0001, INV-0002. Sequential numbering is a legal requirement in many countries and makes it far easier to spot a missing invoice at year end.",
      },
    ],
    related: [
      { href: "/receipt-generator", label: "Receipt generator" },
      { href: "/estimate-generator", label: "Estimate generator" },
      { href: "/quote-generator", label: "Quote generator" },
      { href: "/templates", label: "Invoice templates" },
    ],
  },
  {
    slug: "invoice-maker",
    path: "/invoice-maker",
    kind: "invoice",
    title: "Invoice Maker – Make an Invoice Online Free",
    h1: "Invoice Maker",
    description:
      "Make an invoice online in under two minutes. Free invoice maker with live preview, logo upload and instant PDF download.",
    intro:
      "A straightforward invoice maker: type into the form, see the finished document update as you go, and download the PDF when you are happy.",
    bullets: COMMON_BULLETS,
    templateId: "professional",
    sections: [
      {
        heading: "Make an invoice without spreadsheets",
        paragraphs: [
          "Most people start invoicing in a spreadsheet, then discover the problems: the formulas break when a row is inserted, the totals disagree with the tax line, and exporting to PDF produces something that looks like a spreadsheet. An invoice maker removes all three problems by treating the document as a document rather than a grid.",
          "Every total on this page is recalculated as you type, including per-line tax rates and a discount applied proportionally across lines, so the subtotal, tax and grand total can never drift apart.",
        ],
      },
      {
        heading: "What makes an invoice look professional",
        paragraphs: [
          "Clients pay documents that look like they came from a business. Three things do most of the work: a logo in the header, consistent typography, and a clearly separated total.",
        ],
        list: [
          "Put the amount due where the eye lands first — top right or bottom right",
          "State the due date as a date, not as \"net 30\"",
          "Give every line a description a stranger could understand",
          "Include your payment details on the invoice itself, not in the email",
          "Keep one template and use it for every client",
        ],
      },
      {
        heading: "Making changes after you send",
        paragraphs: [
          "If you spot a mistake after sending, do not quietly edit and resend under the same number. Issue a credit note or a corrected invoice with a new number and reference the original. Auditors look for exactly this, and clients' accounting systems often refuse a second file with a number they have already booked.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between an invoice maker and an invoice generator?",
        answer:
          "Nothing — they are two names for the same tool. This page and our invoice generator page use the same editor and produce the same PDF.",
      },
      {
        question: "Can I edit an invoice after downloading it?",
        answer:
          "Your draft stays in the browser, so you can come back, change a line and download a fresh PDF. The downloaded PDF itself is final and not editable, which is what you want for a document a client will file.",
      },
      {
        question: "Can I make an invoice on my phone?",
        answer:
          "Yes. On a small screen the editor switches to Edit and Preview tabs so you can fill the form and then check the finished document full width.",
      },
    ],
    related: [
      { href: "/invoice-generator", label: "Free invoice generator" },
      { href: "/pdf-invoice-generator", label: "PDF invoice generator" },
      { href: "/templates", label: "Invoice templates" },
    ],
  },
  {
    slug: "pdf-invoice-generator",
    path: "/pdf-invoice-generator",
    kind: "invoice",
    title: "PDF Invoice Generator – Download Invoices as PDF Free",
    h1: "PDF Invoice Generator",
    description:
      "Generate an invoice and download it as a PDF instantly. Free PDF invoice generator with five templates, logo support and 16 currencies.",
    intro:
      "Build the invoice on this page and download a real PDF — vector text, A4 page size, ready to email or print.",
    bullets: ["True PDF, not an image", "A4 page size", "Free and unlimited"],
    sections: [
      {
        heading: "Why send invoices as PDF",
        paragraphs: [
          "PDF is the only common format that looks identical on every device and cannot be accidentally altered in transit. A Word file reflows when the recipient has different fonts; a spreadsheet exposes your formulas; a screenshot is unreadable when printed. A PDF arrives exactly as you designed it.",
          "The PDFs produced here contain real text rather than a rendered picture of text, so your client can copy the invoice number, and their accounting software can read the document automatically.",
        ],
      },
      {
        heading: "How the PDF is generated",
        paragraphs: [
          "When you press Download PDF, the data in the editor is sent to our server, validated, and laid out as an A4 document using the same template you selected in the preview. The finished file is returned straight to your browser and is not stored afterwards.",
          "Because the totals are recalculated on the server rather than trusted from the browser, the numbers printed on the PDF always match the arithmetic of the line items.",
        ],
      },
      {
        heading: "Printing your invoice",
        paragraphs: [
          "The page is sized for A4 with margins wide enough that nothing is clipped by a home printer. If you are in the United States and printing on Letter, choose \"Fit to page\" in the print dialog — the layout has enough slack that no content is lost.",
        ],
      },
    ],
    faq: [
      {
        question: "Is the PDF a real PDF or an image?",
        answer:
          "A real PDF with selectable, searchable text. That matters because most accounts payable systems scan invoices automatically and reject flattened images.",
      },
      {
        question: "What page size is used?",
        answer:
          "A4, which is the international standard. It prints on US Letter without loss if you choose Fit to page.",
      },
      {
        question: "Does the PDF include my logo?",
        answer:
          "Yes. PNG, JPG and WebP logos up to 2 MB are embedded in the PDF header.",
      },
      {
        question: "Is there a watermark?",
        answer: "No. The free PDF has no watermark and no branding of ours on it.",
      },
    ],
    related: [
      { href: "/invoice-generator", label: "Free invoice generator" },
      { href: "/invoice-maker", label: "Invoice maker" },
      { href: "/receipt-generator", label: "Receipt generator" },
    ],
  },
  {
    slug: "receipt-generator",
    path: "/receipt-generator",
    kind: "receipt",
    title: "Free Receipt Generator – Create Receipts Online (PDF)",
    h1: "Free Receipt Generator",
    description:
      "Create and download payment receipts as PDF for free. Simple receipt generator for cash, card and bank transfer payments.",
    intro:
      "Issue a receipt confirming a payment you have already received. No due date, no chasing — just proof that the money arrived.",
    bullets: ["Proof of payment", "Free PDF download", "No registration required"],
    templateId: "minimal",
    sections: [
      {
        heading: "What is a receipt?",
        paragraphs: [
          "A receipt is written confirmation that a payment has been made. Unlike an invoice, it creates no obligation — it closes one. The buyer keeps it to prove the expense, and you keep it to show the invoice was settled.",
          "For cash payments the receipt is often the only record either party has, which is why it should name both parties, the amount, the date and what the payment was for.",
        ],
      },
      {
        heading: "When you must issue a receipt",
        paragraphs: [
          "Rules vary, but a receipt is generally expected whenever a customer pays in cash, whenever they ask for one, and whenever the payment is for something they will claim as a business expense.",
        ],
        list: [
          "Cash payments of any size",
          "Deposits and part payments against a larger invoice",
          "Rent, tuition and other recurring personal payments",
          "Any payment a customer will claim back from an employer or the tax office",
        ],
      },
      {
        heading: "Receipt vs invoice",
        paragraphs: [
          "Issue the invoice when the work is done and payment is due. Issue the receipt when the money lands. If a customer pays immediately, the receipt on its own is enough. If they pay on terms, you will end up issuing both, and both should carry the same reference so they can be matched later.",
        ],
      },
    ],
    faq: [
      {
        question: "Does a receipt need a number?",
        answer:
          "It is not always a legal requirement, but numbering receipts sequentially makes reconciliation far easier and is expected by most accountants.",
      },
      {
        question: "Can I use this for a cash receipt?",
        answer:
          "Yes. Set the payment date, describe what was paid for, and note the payment method in the notes field.",
      },
      {
        question: "Should a receipt show tax?",
        answer:
          "If tax was charged on the original sale, show it. Customers reclaiming VAT or sales tax need the tax amount stated separately.",
      },
    ],
    related: [
      { href: "/invoice-generator", label: "Free invoice generator" },
      { href: "/estimate-generator", label: "Estimate generator" },
    ],
  },
  {
    slug: "estimate-generator",
    path: "/estimate-generator",
    kind: "estimate",
    title: "Free Estimate Generator – Create Estimates Online (PDF)",
    h1: "Free Estimate Generator",
    description:
      "Create professional estimates online for free and download them as PDF. Ideal for contractors, tradespeople and freelancers.",
    intro:
      "Give a client a clear, itemised estimate before work starts — and set expectations about what could change.",
    bullets: ["Valid-until date", "Itemised pricing", "Free PDF download"],
    templateId: "freelance",
    sections: [
      {
        heading: "What is an estimate?",
        paragraphs: [
          "An estimate is a considered guess at what a job will cost. It is not a contract and it does not bind you to the figure, but it does set the client's expectations — so the wider your uncertainty, the more explicitly you should say so on the document.",
          "The most useful estimates break the job into lines. A single number invites haggling over the total; five lines invite a conversation about scope, which is the conversation you actually want.",
        ],
      },
      {
        heading: "Estimate vs quote",
        paragraphs: [
          "A quote is a fixed price you are prepared to be held to. An estimate is an approximation you expect to revise once the work is scoped. Using the wrong word can cost you: a client who was given an \"estimate\" understands the final bill may differ, while a client given a \"quote\" reasonably expects the number to hold.",
          "If you are ready to commit to a price, use the quote generator instead.",
        ],
      },
      {
        heading: "How to write an estimate that gets accepted",
        paragraphs: [
          "Three habits raise acceptance rates more than pricing does: itemise, date it, and say what is excluded.",
        ],
        list: [
          "Break the work into lines the client can recognise",
          "State a valid-until date so the estimate has urgency",
          "List exclusions explicitly — materials, travel, revisions beyond a number",
          "Say what would trigger a revised estimate",
          "Include your payment terms now, not at invoice time",
        ],
      },
    ],
    faq: [
      {
        question: "Is an estimate legally binding?",
        answer:
          "Generally no, as long as the document is clearly labelled an estimate and does not read as a firm offer. A quote, by contrast, can be treated as a binding offer once accepted.",
      },
      {
        question: "How long should an estimate stay valid?",
        answer:
          "Thirty days is the common default. Shorten it when your material costs are volatile.",
      },
      {
        question: "Can I turn an estimate into an invoice?",
        answer:
          "Yes. Once the work is done, open the invoice generator and re-enter the agreed lines, or adjust them to match what was actually delivered.",
      },
    ],
    related: [
      { href: "/quote-generator", label: "Quote generator" },
      { href: "/invoice-generator", label: "Free invoice generator" },
    ],
  },
  {
    slug: "quote-generator",
    path: "/quote-generator",
    kind: "quote",
    title: "Free Quote Generator – Create Price Quotes Online (PDF)",
    h1: "Free Quote Generator",
    description:
      "Create fixed-price quotes online for free and download them as PDF. Includes a valid-until date, itemised lines and multiple currencies.",
    intro:
      "Send a fixed price a client can accept. Itemised, dated, and downloadable as a PDF in one click.",
    bullets: ["Fixed-price document", "Valid-until date", "Free PDF download"],
    templateId: "modern",
    sections: [
      {
        heading: "What is a quote?",
        paragraphs: [
          "A quote is a firm offer to do a defined piece of work for a stated price. Once the client accepts it, both sides are generally expected to honour it — which makes precision about scope the single most important part of the document.",
          "That precision lives in the line descriptions. \"Website\" is a quote you will regret; \"Five-page WordPress site, one round of revisions, client supplies copy and images\" is a quote you can hold.",
        ],
      },
      {
        heading: "What to include in a quote",
        paragraphs: [
          "Everything an invoice needs, plus the boundaries of the offer.",
        ],
        list: [
          "A unique quote number and issue date",
          "A valid-until date after which the price may change",
          "Itemised scope with clear inclusions",
          "An explicit exclusions list",
          "Tax treatment — is the price inclusive or exclusive?",
          "Payment schedule, including any deposit",
        ],
      },
      {
        heading: "Following up on a quote",
        paragraphs: [
          "Most quotes are lost to silence rather than to price. A short follow-up two or three days after sending, referencing the quote number and the valid-until date, recovers a surprising share of them.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a quote binding?",
        answer:
          "Once accepted, a quote is usually treated as a binding agreement on price and scope. That is the difference between a quote and an estimate.",
      },
      {
        question: "Can I add a deposit to a quote?",
        answer:
          "Yes. Add the deposit terms to the payment terms field, for example a 50% deposit on acceptance with the balance on completion.",
      },
      {
        question: "What if my costs change after the client accepts?",
        answer:
          "Include a clause in the notes stating what may trigger a revision — a change in scope, materials price movement beyond a threshold, or delays caused by the client.",
      },
    ],
    related: [
      { href: "/estimate-generator", label: "Estimate generator" },
      { href: "/invoice-generator", label: "Free invoice generator" },
    ],
  },
  {
    slug: "proforma-invoice-generator",
    path: "/proforma-invoice-generator",
    kind: "proforma",
    title: "Free Proforma Invoice Generator – Create Proforma Invoices (PDF)",
    h1: "Free Proforma Invoice Generator",
    description:
      "Create a proforma invoice online for free. Ideal for international shipping, customs and advance payment requests. Instant PDF download.",
    intro:
      "Issue a proforma invoice for advance payment, customs clearance or a purchase order — before the final invoice.",
    bullets: ["Customs and shipping ready", "16 currencies", "Free PDF download"],
    templateId: "classic",
    sections: [
      {
        heading: "What is a proforma invoice?",
        paragraphs: [
          "A proforma invoice is a preliminary bill of sale sent before goods are delivered. It states what will be supplied and at what price, but it is not a demand for payment and it is not booked as revenue. Buyers use it to raise a purchase order, arrange finance, or clear customs.",
          "Because it is not a tax invoice, it should not be used to reclaim VAT or sales tax. The final invoice, issued once the goods ship, is the document that carries tax consequences.",
        ],
      },
      {
        heading: "When to use a proforma invoice",
        paragraphs: [
          "It is the standard document in three situations.",
        ],
        list: [
          "International shipments, where customs needs a declared value before arrival",
          "New customers who must pay in advance",
          "Corporate buyers whose procurement process requires a document before a purchase order can be raised",
        ],
      },
      {
        heading: "Proforma invoice vs commercial invoice",
        paragraphs: [
          "A commercial invoice is the final, binding document that accompanies a shipment and is used to assess duty. A proforma invoice is its provisional counterpart, issued earlier and subject to change. Customs authorities generally accept a proforma for pre-clearance but require the commercial invoice on arrival.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a proforma invoice a legal invoice?",
        answer:
          "No. It is a provisional document. It does not create a receivable and should not be entered into your sales ledger as revenue.",
      },
      {
        question: "Can a customer pay against a proforma invoice?",
        answer:
          "Yes, and that is often the point — it is the standard way to request payment in advance. Issue a full tax invoice once the payment is received or the goods ship.",
      },
      {
        question: "Should a proforma invoice show tax?",
        answer:
          "Show the expected tax so the buyer can budget, but label the document clearly as a proforma so it is not used for a tax reclaim.",
      },
    ],
    related: [
      { href: "/invoice-generator", label: "Free invoice generator" },
      { href: "/vat-invoice-generator", label: "VAT invoice generator" },
    ],
  },
  {
    slug: "vat-invoice-generator",
    path: "/vat-invoice-generator",
    kind: "invoice",
    title: "VAT Invoice Generator – Create VAT Invoices Online Free",
    h1: "VAT Invoice Generator",
    description:
      "Create a compliant VAT invoice online for free. Per-line VAT rates, VAT number field, EUR and GBP support, instant PDF download.",
    intro:
      "Set a VAT rate per line, add your VAT registration number, and download an invoice your client can reclaim against.",
    bullets: ["Per-line VAT rates", "VAT number field", "EUR and GBP ready"],
    currency: "EUR",
    templateId: "professional",
    sections: [
      {
        heading: "What is a VAT invoice?",
        paragraphs: [
          "A VAT invoice is an invoice that meets the extra requirements a VAT-registered business must satisfy so the customer can reclaim the tax. The critical additions over a plain invoice are your VAT registration number, the VAT rate applied to each line, and the VAT amount shown separately from the net amount.",
          "If any of those are missing, the customer's reclaim can be refused — which usually means the invoice comes back to you for reissue.",
        ],
      },
      {
        heading: "What a VAT invoice must show",
        paragraphs: [
          "Requirements differ slightly across jurisdictions, but this list covers the common core in the UK and the EU.",
        ],
        list: [
          "A unique sequential invoice number",
          "Your business name, address and VAT registration number",
          "The customer's name and address, plus their VAT number for cross-border supplies",
          "The tax point — the date the supply took place, which may differ from the invoice date",
          "A description of each supply with the VAT rate applied",
          "The net amount per rate, the VAT amount per rate, and the total VAT",
          "The gross total payable",
        ],
      },
      {
        heading: "Mixed VAT rates on one invoice",
        paragraphs: [
          "Many supplies mix rates — standard-rated consultancy alongside zero-rated printed matter, for example. Because each line carries its own rate in this generator, mixed-rate invoices total correctly without manual arithmetic, and any discount is spread across lines in proportion so the VAT on each rate stays right.",
        ],
      },
      {
        heading: "Reverse charge and zero-rated supplies",
        paragraphs: [
          "Where the reverse charge applies — commonly on B2B services supplied across an EU border — you charge 0% and add a note stating that the customer must account for the VAT. Set the line tax rate to zero and put the wording in the notes field so it prints on the PDF.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I issue a VAT invoice if I am not VAT registered?",
        answer:
          "No. Only a VAT-registered business may charge VAT and issue a VAT invoice. If you are not registered, issue a normal invoice with no VAT line.",
      },
      {
        question: "What is a simplified VAT invoice?",
        answer:
          "Some jurisdictions allow a shortened invoice below a value threshold — typically retail sales — which omits the customer's details. Above the threshold the full set of fields is required.",
      },
      {
        question: "How long must I keep VAT invoices?",
        answer:
          "Six years is the common requirement in the UK and much of the EU, though some member states require ten. Keep the PDFs, not just the accounting entries.",
      },
    ],
    related: [
      { href: "/gst-invoice-generator", label: "GST invoice generator" },
      { href: "/uk-invoice", label: "UK invoice generator" },
      { href: "/germany-invoice", label: "German invoice generator" },
    ],
  },
  {
    slug: "gst-invoice-generator",
    path: "/gst-invoice-generator",
    kind: "invoice",
    title: "GST Invoice Generator – Create GST Invoices Online Free",
    h1: "GST Invoice Generator",
    description:
      "Create a GST invoice online for free with GSTIN fields, per-line GST rates and instant PDF download. Suitable for India, Australia, Canada and Singapore.",
    intro:
      "Add your GSTIN, set a GST rate per line, and download a GST invoice as a PDF.",
    bullets: ["GSTIN field", "Per-line GST rates", "Free PDF download"],
    currency: "INR",
    sections: [
      {
        heading: "What is a GST invoice?",
        paragraphs: [
          "A GST invoice is a tax invoice issued by a business registered for Goods and Services Tax. It has to identify both parties by their registration number and show the GST charged separately, so the recipient can claim an input tax credit.",
          "GST exists under that name in India, Australia, Canada, New Zealand and Singapore, and the details differ in each. What follows is common to all of them; check your local rules for thresholds and wording.",
        ],
      },
      {
        heading: "What a GST invoice should include",
        paragraphs: [
          "Use the Tax ID field for your GSTIN or equivalent registration number, and set the GST rate on each line.",
        ],
        list: [
          "The words \"Tax Invoice\"",
          "Supplier name, address and GST registration number",
          "Recipient name, address and registration number where they are registered",
          "A sequential invoice number and the date of issue",
          "Description, quantity and taxable value of each supply",
          "The GST rate and GST amount per line",
          "The total GST and the total amount payable",
        ],
      },
      {
        heading: "GST in India: CGST, SGST and IGST",
        paragraphs: [
          "Indian GST splits into central and state components for supplies within a state, and a single integrated tax for supplies across state lines. The generator prints a combined GST figure per line; where you need the split shown explicitly, add the breakdown to the notes field, which prints in full on the PDF.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a GST invoice the same as a VAT invoice?",
        answer:
          "They serve the same purpose — letting a registered customer reclaim the tax — but the required fields and the registration number format differ. Use the VAT invoice generator for the UK and EU.",
      },
      {
        question: "Do I need a GSTIN to issue a GST invoice?",
        answer:
          "Yes. Only a registered supplier can charge GST. Unregistered businesses issue a bill of supply or a plain invoice with no tax line.",
      },
      {
        question: "Can I show different GST rates on one invoice?",
        answer:
          "Yes. Each line carries its own rate, so a mixed-rate invoice totals correctly without manual calculation.",
      },
    ],
    related: [
      { href: "/vat-invoice-generator", label: "VAT invoice generator" },
      { href: "/australia-invoice", label: "Australian invoice generator" },
      { href: "/canada-invoice", label: "Canadian invoice generator" },
    ],
  },
];

export function getToolPage(slug: string): ToolPage | undefined {
  return TOOL_PAGES.find((page) => page.slug === slug);
}
