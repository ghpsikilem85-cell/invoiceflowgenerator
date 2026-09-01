import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
        That page does not exist
      </h1>
      <p className="mt-3 text-slate-600">
        The invoice generator is still where you left it.
      </p>
      <Link
        href="/invoice-generator"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Create an invoice
      </Link>
    </div>
  );
}
