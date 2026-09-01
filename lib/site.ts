export const SITE = {
  name: "InvoiceFlowGenerator",
  shortName: "InvoiceFlowGenerator",
  tagline: "Free Invoice Generator",
  description:
    "Create professional invoices online for free. Download PDF invoices instantly with no registration required.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
