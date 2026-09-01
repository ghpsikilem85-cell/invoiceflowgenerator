import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sign in",
    description: "Sign in to save invoices to your dashboard.",
    path: "/login",
  }),
  robots: { index: false, follow: true },
};

export default async function Page() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-2 text-slate-600">
        An account saves your invoices, customers and business profile. The generator itself works
        without one.
      </p>

      {isSupabaseConfigured ? (
        <LoginForm />
      ) : (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Accounts are not configured on this deployment.</p>
          <p className="mt-1">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable sign-in. Everything else on the
            site works without them.
          </p>
        </div>
      )}

      <p className="mt-6 text-sm text-slate-500">
        <Link href="/invoice-generator" className="text-blue-600 hover:text-blue-700">
          Create an invoice without an account →
        </Link>
      </p>
    </div>
  );
}
