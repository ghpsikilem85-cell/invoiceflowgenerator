export interface TemplateSpec {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  /** Brand accent used for headings, rules and the totals block. */
  accent: string;
  /** Background of the table header row. */
  headerBg: string;
  headerText: string;
  /** Layout of the document header. */
  layout: "banner" | "split" | "minimal" | "sidebar" | "centered";
  fontFamily: "sans" | "serif";
  uppercaseTitle: boolean;
}

export const TEMPLATES: TemplateSpec[] = [
  {
    id: "modern",
    name: "Modern",
    slug: "modern",
    tagline: "Bold colour banner, clean grid",
    description:
      "A confident header band with generous spacing. Works well for agencies and studios that want the invoice to look like part of their brand.",
    accent: "#2563eb",
    headerBg: "#eff6ff",
    headerText: "#1e3a8a",
    layout: "banner",
    fontFamily: "sans",
    uppercaseTitle: true,
  },
  {
    id: "professional",
    name: "Professional",
    slug: "professional",
    tagline: "Corporate, serif, understated",
    description:
      "A traditional layout with a serif face and a quiet rule under the header. Suited to consultancies, law and accounting practices.",
    accent: "#0f172a",
    headerBg: "#f1f5f9",
    headerText: "#0f172a",
    layout: "split",
    fontFamily: "serif",
    uppercaseTitle: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    slug: "minimal",
    tagline: "No colour, maximum whitespace",
    description:
      "Nothing but type and hairlines. The cheapest to print, the easiest to read, and the safest choice when you do not have a logo yet.",
    accent: "#111827",
    headerBg: "#ffffff",
    headerText: "#111827",
    layout: "minimal",
    fontFamily: "sans",
    uppercaseTitle: true,
  },
  {
    id: "freelance",
    name: "Freelance",
    slug: "freelance",
    tagline: "Friendly, warm, personal",
    description:
      "A softer accent and a prominent notes block, built for solo work where the payment terms and a thank-you matter as much as the numbers.",
    accent: "#ea580c",
    headerBg: "#fff7ed",
    headerText: "#9a3412",
    layout: "sidebar",
    fontFamily: "sans",
    uppercaseTitle: false,
  },
  {
    id: "classic",
    name: "Classic",
    slug: "classic",
    tagline: "Centred title, formal structure",
    description:
      "A centred document title with balanced address blocks — the format most accountants and tax offices expect to receive.",
    accent: "#065f46",
    headerBg: "#ecfdf5",
    headerText: "#065f46",
    layout: "centered",
    fontFamily: "serif",
    uppercaseTitle: true,
  },
];

const BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));

export function getTemplate(id: string): TemplateSpec {
  return BY_ID.get(id) ?? TEMPLATES[0];
}
