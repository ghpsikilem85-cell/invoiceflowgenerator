"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PLANS,
  yearlySavingMonths,
  type BillingInterval,
  type PaidPlan,
  type Plan,
} from "@/lib/stripe/plans";

interface Props {
  /** Which paid plans actually have a Stripe price configured. */
  purchasable: Record<PaidPlan, boolean>;
  signedIn: boolean;
  currentPlan: Plan;
}

export default function PricingPlans({ purchasable, signedIn, currentPlan }: Props) {
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(plan: PaidPlan) {
    setBusy(plan);
    setError(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.url) throw new Error(body.error ?? "Could not start checkout.");
      window.location.href = body.url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start checkout.");
      setBusy(null);
    }
  }

  async function manageBilling() {
    setBusy("portal");
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.url) throw new Error(body.error ?? "Could not open the portal.");
      window.location.href = body.url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open the portal.");
      setBusy(null);
    }
  }

  return (
    <>
      <div className="mb-8 flex justify-center">
        <div
          role="group"
          aria-label="Billing interval"
          className="inline-flex rounded-lg bg-slate-200 p-1"
        >
          {(["month", "year"] as BillingInterval[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setInterval(option)}
              aria-pressed={interval === option}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                interval === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              {option === "month" ? "Monthly" : "Yearly"}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mb-4 text-center text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const paid = plan.id !== "free";
          const price = interval === "month" ? plan.monthly : plan.yearly;
          const saving = yearlySavingMonths(plan);
          const isCurrent = plan.id === currentPlan;
          const onSale = paid ? purchasable[plan.id as PaidPlan] : true;

          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-xl border bg-white p-6 ${
                plan.highlight ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
                {isCurrent ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Your plan
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-500">{plan.summary}</p>

              <p className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${price.toFixed(2).replace(/\.00$/, "")}
                </span>{" "}
                <span className="text-sm text-slate-500">
                  {plan.monthly === 0 ? "forever" : interval === "month" ? "per month" : "per year"}
                </span>
              </p>
              {paid && interval === "year" && saving > 0 ? (
                <p className="mt-1 text-xs font-semibold text-emerald-600">
                  {saving} months free versus monthly
                </p>
              ) : null}

              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden className="text-emerald-600">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {!paid ? (
                  <Link
                    href="/invoice-generator"
                    className="block rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Create an invoice
                  </Link>
                ) : isCurrent ? (
                  <button
                    type="button"
                    onClick={manageBilling}
                    disabled={busy !== null}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {busy === "portal" ? "Opening…" : "Manage billing"}
                  </button>
                ) : !onSale ? (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
                  >
                    Coming soon
                  </button>
                ) : !signedIn ? (
                  <Link
                    href="/login"
                    className={`block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Sign in to subscribe
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => subscribe(plan.id as PaidPlan)}
                    disabled={busy !== null}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {busy === plan.id ? "Redirecting…" : `Subscribe to ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
