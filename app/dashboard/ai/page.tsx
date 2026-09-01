import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AiTools from "@/components/AiTools";
import { isAiConfigured } from "@/lib/ai/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AI tools",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!isSupabaseConfigured) redirect("/dashboard");

  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">AI tools</h1>
        <p className="mt-1 text-slate-600">
          Five small jobs that sit around the invoice: drafting it, tidying a line, chasing it, and
          sending it in your client&apos;s language.
        </p>
      </div>

      <AiTools configured={isAiConfigured} />
    </div>
  );
}
