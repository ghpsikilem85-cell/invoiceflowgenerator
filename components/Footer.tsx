import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

const TOOLS = [
  { href: "/invoice-generator", label: "Free invoice generator" },
  { href: "/invoice-maker", label: "Invoice maker" },
  { href: "/pdf-invoice-generator", label: "PDF invoice generator" },
  { href: "/receipt-generator", label: "Receipt generator" },
  { href: "/estimate-generator", label: "Estimate generator" },
  { href: "/quote-generator", label: "Quote generator" },
  { href: "/proforma-invoice-generator", label: "Proforma invoice generator" },
];

const PROFESSIONS = [
  { href: "/invoice-generator/freelancer", label: "Freelancers" },
  { href: "/invoice-generator/consultant", label: "Consultants" },
  { href: "/invoice-generator/photographer", label: "Photographers" },
  { href: "/invoice-generator/web-developer", label: "Web developers" },
  { href: "/invoice-generator/graphic-designer", label: "Graphic designers" },
  { href: "/invoice-generator/contractor", label: "Contractors" },
  { href: "/invoice-generator/writer", label: "Writers" },
];

const COUNTRIES = [
  { href: "/us-invoice", label: "United States" },
  { href: "/uk-invoice", label: "United Kingdom" },
  { href: "/canada-invoice", label: "Canada" },
  { href: "/australia-invoice", label: "Australia" },
  { href: "/germany-invoice", label: "Germany" },
  { href: "/france-invoice", label: "France" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title="Tools" links={TOOLS} />
        <FooterColumn title="For your trade" links={PROFESSIONS} />
        <FooterColumn
          title="Templates"
          links={TEMPLATES.map((t) => ({
            href: `/templates/${t.slug}`,
            label: `${t.name} template`,
          }))}
        />
        <FooterColumn title="By country" links={COUNTRIES} />
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} InvoiceFlowGenerator. Free invoice generator.</p>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-slate-800">
              Blog
            </Link>
            <Link href="/pricing" className="hover:text-slate-800">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-slate-800">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-800">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      <ul className="space-y-2 text-sm text-slate-600">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
