import Link from "next/link";

const LINKS = [
  { href: "/invoice-generator", label: "Invoice generator" },
  { href: "/templates", label: "Templates" },
  { href: "/receipt-generator", label: "Receipt" },
  { href: "/estimate-generator", label: "Estimate" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link
          href="/"
          className="shrink-0 text-base font-bold tracking-tight text-slate-900 sm:text-lg"
        >
          Invoice<span className="text-blue-600">Flow</span>Generator
        </Link>

        <ul className="hidden flex-1 items-center gap-5 text-sm text-slate-600 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-slate-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
            Sign in
          </Link>
          <Link
            href="/invoice-generator"
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create invoice
          </Link>
        </div>
      </nav>
    </header>
  );
}
