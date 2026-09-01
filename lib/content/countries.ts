import type { ContentSection } from "@/components/GeneratorPage";
import type { FaqItem } from "@/lib/seo";

export interface CountryPage {
  slug: string;
  path: string;
  country: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  currency: string;
  templateId: string;
  /** Rates surfaced in the copy so each page carries real, differing detail. */
  taxName: string;
  standardRate: string;
  taxIdName: string;
  sections: ContentSection[];
  faq: FaqItem[];
}

export const COUNTRY_PAGES: CountryPage[] = [
  {
    slug: "us-invoice",
    path: "/us-invoice",
    country: "United States",
    title: "US Invoice Generator – Free Invoice Template for the USA",
    h1: "US Invoice Generator",
    description:
      "Create a US invoice online for free. Dollar formatting, sales tax per line, EIN field and instant PDF download.",
    intro:
      "Invoice in US dollars with sales tax handled per line and space for your EIN.",
    currency: "USD",
    templateId: "modern",
    taxName: "Sales tax",
    standardRate: "0%–10.25% depending on state and city",
    taxIdName: "EIN or SSN",
    sections: [
      {
        heading: "Sales tax on a US invoice",
        paragraphs: [
          "The United States has no national sales tax. Rates are set by states, counties and cities, so the correct rate depends on where the sale is sourced — which for most services means the customer's location. Combined rates range from zero in states such as Oregon and Delaware to over 10% in parts of Louisiana, Illinois and California.",
          "Many professional services are not taxable at all in most states. Because each line in this generator carries its own rate, you can charge tax on a taxable product line and leave a service line at zero on the same invoice.",
        ],
      },
      {
        heading: "What a US invoice should include",
        paragraphs: [
          "There is no federally mandated invoice format, but this is what US clients and their accounts payable systems expect.",
        ],
        list: [
          "Your business name, address and EIN (or SSN if you are a sole proprietor)",
          "The client's legal entity name — not their trading name — and billing address",
          "A unique invoice number and the invoice date",
          "Payment terms stated as a date, alongside the familiar Net 30 shorthand",
          "Itemised lines with quantity, unit price and any applicable sales tax",
          "Remittance details: ACH routing and account number, or a payment link",
        ],
      },
      {
        heading: "Form 1099-NEC and your invoices",
        paragraphs: [
          "If you are a contractor paid $600 or more in a year by a US business, that business files a 1099-NEC reporting what it paid you. Your own invoices are the record you reconcile that form against — and mismatches are common, usually because a payment landed in January for work invoiced in December. Keep the PDFs.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I have to charge sales tax on services in the US?",
        answer:
          "In most states professional services are exempt, but a growing number tax specific services such as software, digital goods and some consulting. Check your state's department of revenue for your category.",
      },
      {
        question: "Should I put my SSN on an invoice?",
        answer:
          "Avoid it. Get an EIN from the IRS — it is free and it means you never have to circulate your Social Security number to clients.",
      },
      {
        question: "What does Net 30 mean?",
        answer:
          "Payment is due 30 days from the invoice date. Always print the actual due date as well, since Net 30 is interpreted inconsistently.",
      },
    ],
  },
  {
    slug: "uk-invoice",
    path: "/uk-invoice",
    country: "United Kingdom",
    title: "UK Invoice Generator – Free VAT Invoice Template UK",
    h1: "UK Invoice Generator",
    description:
      "Create a UK invoice online for free. Pound sterling formatting, 20% VAT support, VAT number field and instant PDF download.",
    intro:
      "Invoice in pounds with VAT handled per line and your VAT registration number on the document.",
    currency: "GBP",
    templateId: "professional",
    taxName: "VAT",
    standardRate: "20% standard, 5% reduced, 0% zero-rated",
    taxIdName: "VAT registration number",
    sections: [
      {
        heading: "VAT on a UK invoice",
        paragraphs: [
          "The standard UK VAT rate is 20%, with a reduced rate of 5% on things such as domestic fuel and a zero rate on most food, books and children's clothing. You must register for VAT once your taxable turnover passes the HMRC threshold, and you may register voluntarily below it.",
          "Only registered businesses may charge VAT. If you are not registered, issue a plain invoice with no VAT line — charging VAT without a registration number is an offence, not an oversight.",
        ],
      },
      {
        heading: "What a UK invoice must show",
        paragraphs: [
          "HMRC sets out required fields for a full VAT invoice. A non-VAT invoice needs less, but the first five items below apply to everyone.",
        ],
        list: [
          "A unique, sequential invoice number",
          "Your business name and address",
          "The customer's name and address",
          "A clear description of the goods or services",
          "The date of supply and the invoice date",
          "Your VAT registration number, if registered",
          "The VAT rate and amount for each line, and the total VAT",
          "The total payable including VAT",
        ],
      },
      {
        heading: "Late payment and statutory interest",
        paragraphs: [
          "UK businesses have a statutory right to charge interest on late commercial payments — currently the Bank of England base rate plus 8% — plus a fixed recovery cost per invoice. Stating this on the invoice itself is legal, common, and noticeably effective at moving an invoice up a payment run.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need to be VAT registered to invoice in the UK?",
        answer:
          "No. Below the registration threshold you invoice without VAT. You must register once taxable turnover passes the threshold on a rolling twelve-month basis.",
      },
      {
        question: "How long must I keep UK invoices?",
        answer:
          "Six years for VAT records. Keep the PDFs, not just the ledger entries, since HMRC can ask to see the documents themselves.",
      },
      {
        question: "What is a self-billing invoice?",
        answer:
          "An arrangement where the customer raises the invoice on your behalf. It requires a written agreement between both parties and is common with large agencies and platforms.",
      },
    ],
  },
  {
    slug: "canada-invoice",
    path: "/canada-invoice",
    country: "Canada",
    title: "Canada Invoice Generator – Free GST/HST Invoice Template",
    h1: "Canadian Invoice Generator",
    description:
      "Create a Canadian invoice online for free. GST, HST and QST support, business number field and instant PDF download.",
    intro:
      "Invoice in Canadian dollars with GST, HST or provincial tax set per line.",
    currency: "CAD",
    templateId: "classic",
    taxName: "GST/HST",
    standardRate: "5% GST, or 13%–15% HST in participating provinces",
    taxIdName: "GST/HST business number",
    sections: [
      {
        heading: "GST, HST, PST and QST",
        paragraphs: [
          "Canada layers a federal 5% GST with provincial taxes. Five provinces merge the two into a single Harmonised Sales Tax of 13% or 15%; British Columbia, Saskatchewan and Manitoba add a separate PST on top of GST; and Quebec runs its own QST alongside it. Alberta and the territories charge GST alone.",
          "Which rate applies usually depends on where the customer is, not where you are. Setting the rate per line in the generator lets you handle a mixed invoice — taxable services alongside a zero-rated item — without splitting it into two documents.",
        ],
      },
      {
        heading: "The small supplier threshold",
        paragraphs: [
          "You are not required to register for GST/HST until your revenues exceed the CRA's small supplier threshold over four consecutive calendar quarters. Below it you charge no GST and cannot claim input tax credits. Many contractors register voluntarily anyway, precisely to claim those credits.",
        ],
      },
      {
        heading: "What a Canadian invoice needs",
        paragraphs: [
          "The CRA sets out what a customer needs in order to claim an input tax credit, and the requirements get stricter as the invoice value rises.",
        ],
        list: [
          "Your business name and the date of the invoice",
          "Your GST/HST registration number once registered",
          "The total amount payable",
          "The amount of GST/HST charged, or a statement that it is included",
          "The customer's name for invoices above the CRA threshold",
          "A description of each item supplied and the terms of payment",
        ],
      },
    ],
    faq: [
      {
        question: "Do I charge GST or HST?",
        answer:
          "It depends on the customer's province. Supplies into Ontario or the Atlantic provinces generally carry HST; supplies into Alberta carry GST only.",
      },
      {
        question: "Do I charge Canadian tax to a US client?",
        answer:
          "Exports of services to a non-resident are commonly zero-rated, meaning you charge 0% but can still claim input tax credits. The rules have exceptions — confirm your situation with an accountant.",
      },
      {
        question: "Do I need a business number to invoice?",
        answer:
          "Not to issue an invoice, but you need one to charge GST/HST, and customers need it printed on the invoice to claim their credit.",
      },
    ],
  },
  {
    slug: "australia-invoice",
    path: "/australia-invoice",
    country: "Australia",
    title: "Australia Invoice Generator – Free Tax Invoice Template",
    h1: "Australian Invoice Generator",
    description:
      "Create an Australian tax invoice online for free. 10% GST, ABN field, AUD formatting and instant PDF download.",
    intro:
      "Invoice in Australian dollars with 10% GST and your ABN on the document.",
    currency: "AUD",
    templateId: "modern",
    taxName: "GST",
    standardRate: "10%",
    taxIdName: "ABN",
    sections: [
      {
        heading: "Tax invoices and the ABN",
        paragraphs: [
          "In Australia the document is called a tax invoice, and it must carry your Australian Business Number. Leaving the ABN off has an immediate financial consequence: the payer is generally required to withhold 47% of the payment and remit it to the ATO.",
          "Registration for GST is compulsory once turnover reaches the ATO threshold, and for taxi and ride-share drivers from the first dollar. Below the threshold you can register voluntarily.",
        ],
      },
      {
        heading: "What an Australian tax invoice must show",
        paragraphs: [
          "The ATO's requirements are specific, and different for invoices above and below A$1,000.",
        ],
        list: [
          "The words \"Tax invoice\"",
          "Your identity and your ABN",
          "The date the invoice was issued",
          "A description of the items sold, including quantity and price",
          "The GST amount, or a statement that the total includes GST",
          "The extent to which each sale includes GST, where the invoice mixes taxable and GST-free items",
          "The buyer's identity or ABN for invoices of A$1,000 or more",
        ],
      },
      {
        heading: "GST-free supplies",
        paragraphs: [
          "Basic food, most medical services and exports are GST-free. Because each line carries its own rate here, you can charge 10% on a consulting line and 0% on a GST-free line on the same tax invoice, which is exactly what the ATO expects for a mixed supply.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need an ABN to invoice in Australia?",
        answer:
          "In practice, yes. Without an ABN on the invoice, a business customer must withhold 47% of the payment under the no-ABN withholding rules.",
      },
      {
        question: "When do I have to register for GST?",
        answer:
          "Once your annual turnover reaches the ATO's registration threshold. Ride-share and taxi drivers must register regardless of turnover.",
      },
      {
        question: "What is the difference between an invoice and a tax invoice?",
        answer:
          "Only a GST-registered business issues a tax invoice, and only a tax invoice lets the buyer claim a GST credit. If you are not registered, issue a plain invoice and do not use the words \"tax invoice\".",
      },
    ],
  },
  {
    slug: "germany-invoice",
    path: "/germany-invoice",
    country: "Germany",
    title: "German Invoice Generator – Free Rechnung Template",
    h1: "German Invoice Generator",
    description:
      "Create a German invoice (Rechnung) online for free. 19% and 7% VAT, USt-IdNr field, EUR formatting and instant PDF download.",
    intro:
      "Invoice in euros with 19% or 7% Umsatzsteuer and your tax number on the document.",
    currency: "EUR",
    templateId: "professional",
    taxName: "Umsatzsteuer (VAT)",
    standardRate: "19% standard, 7% reduced",
    taxIdName: "Steuernummer or USt-IdNr",
    sections: [
      {
        heading: "The Rechnung and its mandatory fields",
        paragraphs: [
          "German invoicing rules are prescriptive. Section 14 of the Umsatzsteuergesetz lists the fields a Rechnung must contain, and a missing field can cost your customer their input tax deduction — which is why German clients return incomplete invoices rather than paying them.",
          "The standard rate is 19%, with 7% applying to food, books, public transport and cultural admissions.",
        ],
      },
      {
        heading: "Required fields on a German invoice",
        paragraphs: [
          "All of these belong on the document itself, not in the covering email.",
        ],
        list: [
          "Full name and address of both supplier and customer",
          "Your Steuernummer or your USt-IdNr (VAT identification number)",
          "The invoice date and a unique, sequential invoice number",
          "Quantity and standard description of the goods or services",
          "The date of supply or performance, where it differs from the invoice date",
          "The net amount broken down by tax rate, the rate applied, and the tax amount",
          "Any agreed discount arrangement (Skonto) stated in advance",
          "For exempt supplies, the reason for the exemption",
        ],
      },
      {
        heading: "Kleinunternehmerregelung",
        paragraphs: [
          "Small businesses under the Kleinunternehmer scheme charge no VAT. If that is you, set every line to 0% and add the required note to the notes field — something to the effect that no VAT is charged under §19 UStG. The note is mandatory, not optional politeness.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between Steuernummer and USt-IdNr?",
        answer:
          "The Steuernummer is issued by your local tax office for domestic purposes; the USt-IdNr is the EU-wide VAT identification number used for cross-border supplies. Either can appear on a domestic invoice; cross-border B2B needs the USt-IdNr.",
      },
      {
        question: "How long must German invoices be kept?",
        answer:
          "Ten years for businesses, from the end of the year in which the invoice was issued.",
      },
      {
        question: "What is Skonto?",
        answer:
          "An early-payment discount, for example 2% if paid within ten days. It must be stated on the invoice to be claimable.",
      },
    ],
  },
  {
    slug: "france-invoice",
    path: "/france-invoice",
    country: "France",
    title: "French Invoice Generator – Free Facture Template",
    h1: "French Invoice Generator",
    description:
      "Create a French invoice (facture) online for free. 20% TVA, SIRET and TVA number fields, EUR formatting and instant PDF download.",
    intro:
      "Invoice in euros with 20% TVA and your SIRET and TVA numbers on the document.",
    currency: "EUR",
    templateId: "classic",
    taxName: "TVA",
    standardRate: "20% standard, 10% and 5.5% reduced",
    taxIdName: "SIRET and numéro de TVA",
    sections: [
      {
        heading: "The facture and French requirements",
        paragraphs: [
          "French invoicing rules are among the most detailed in the EU, and penalties for a non-compliant facture are levied per invoice. The standard TVA rate is 20%, with reduced rates of 10% on restaurants and transport and 5.5% on most food and books.",
          "Two obligations catch foreign suppliers out: the late-payment penalty rate and the fixed recovery indemnity must both be stated on the invoice itself, and every invoice must carry a unique number in an unbroken chronological sequence.",
        ],
      },
      {
        heading: "Mandatory mentions on a facture",
        paragraphs: [
          "Put these on the document; several are legally required wordings rather than data fields.",
        ],
        list: [
          "The word \"Facture\", a unique sequential number and the issue date",
          "Your business name, address and SIRET number",
          "Your numéro de TVA intracommunautaire where registered",
          "The customer's name, address and TVA number for B2B supplies",
          "The date of the supply and the payment due date",
          "Unit price excluding tax, quantity, TVA rate and total per rate",
          "The late-payment penalty rate applied to overdue amounts",
          "The fixed indemnity for recovery costs on late B2B payments",
        ],
      },
      {
        heading: "Auto-entrepreneurs and TVA franchise",
        paragraphs: [
          "Auto-entrepreneurs under the franchise en base de TVA charge no tax. If that applies to you, set every line to 0% and add the mandatory mention to the notes field stating that TVA is not applicable under article 293 B of the CGI.",
        ],
      },
    ],
    faq: [
      {
        question: "What is a SIRET number?",
        answer:
          "A fourteen-digit identifier for a French business establishment. It must appear on your invoices and is how clients verify you are properly registered.",
      },
      {
        question: "Do I have to state late payment penalties on a French invoice?",
        answer:
          "Yes, for B2B invoices. Both the penalty rate and the fixed forty-euro recovery indemnity are mandatory mentions.",
      },
      {
        question: "How long must French invoices be kept?",
        answer:
          "Ten years from the close of the financial year for accounting purposes.",
      },
    ],
  },
];

export function getCountryPage(slug: string): CountryPage | undefined {
  return COUNTRY_PAGES.find((page) => page.slug === slug);
}
