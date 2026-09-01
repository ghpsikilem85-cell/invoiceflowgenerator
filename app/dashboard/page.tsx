import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import PlanBadge from "@/components/PlanBadge";
import { formatDate, formatMoney } from "@/lib/currency";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface InvoiceRow {
  id: string;
  invoice_number: string;
  kind: string;
  status: string;
  customer_name: string;
  currency: string;
  total: number;
  invoice_date: string | null;
  due_date: string | null;
}

export default async function Page() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Accounts are not configured on this deployment.</p>
          <p className="mt-1">
            Run <code>database/schema.sql</code> against a Supabase project and set the two
            <code> NEXT_PUBLIC_SUPABASE_*</code> environment variables to enable the dashboard.
          </p>
        </div>
        <Link
          href="/invoice-generator"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create an invoice
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = (await supabase!.auth.getUser()) ?? { data: { user: null } };

  if (!user) redirect("/login");

  const { data: profile } = await supabase!
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const { data, error } = await supabase!
    .from("invoices")
    .select(
      "id, invoice_number, kind, status, customer_name, currency, total, invoice_date, due_date"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const invoices = (data ?? []) as InvoiceRow[];
  const outstanding = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + Number(invoice.total), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <PlanBadge plan={(profile?.plan as string) ?? "free"} />
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ai"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            AI tools
          </Link>
          <Link
            href="/invoice-generator"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Create invoice
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Saved documents" value={String(invoices.length)} />
        <Stat
          label="Outstanding"
          value={formatMoney(outstanding, invoices[0]?.currency ?? "USD")}
        />
        <Stat
          label="Paid"
          value={String(invoices.filter((invoice) => invoice.status === "paid").length)}
        />
      </div>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Recent invoices</h2>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load your invoices. Check that <code>database/schema.sql</code> has been run
          against this Supabase project.
        </p>
      ) : invoices.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Nothing saved yet. Create an invoice and press Save invoice to see it here.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{invoice.customer_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {invoice.invoice_date ? formatDate(invoice.invoice_date) : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {invoice.due_date ? formatDate(invoice.due_date) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {formatMoney(Number(invoice.total), invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
