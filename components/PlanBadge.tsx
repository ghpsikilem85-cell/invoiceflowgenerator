"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Shows the current plan and, for subscribers, a way into Stripe's billing
 * portal. Free users get a link to the pricing page instead.
 */
export default function PlanBadge({ plan }: { plan: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manageBilling() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.url) throw new Error(body.error ?? "Could not open the portal.");
      window.location.href = body.url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open the portal.");
      setBusy(false);
    }
  }

  const label = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className="flex items-center gap-3">
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
          plan === "free" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"
        }`}
      >
        {label}
      </span>

      {plan === "free" ? (
        <Link href="/pricing" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Upgrade
        </Link>
      ) : (
        <button
          type="button"
          onClick={manageBilling}
          disabled={busy}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
        >
          {busy ? "Opening…" : "Manage billing"}
        </button>
      )}

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </div>
  );
}
