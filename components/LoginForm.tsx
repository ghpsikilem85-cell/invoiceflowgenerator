"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isGoogleAuthEnabled } from "@/lib/supabase/config";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function sendMagicLink(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setBusy(false);
    setMessage(
      error
        ? { tone: "error", text: error.message }
        : { tone: "ok", text: "Check your inbox for the sign-in link." }
    );
  }

  async function signInWithGoogle() {
    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) setMessage({ tone: "error", text: error.message });
  }

  return (
    <div className="mt-6 space-y-4">
      {isGoogleAuthEnabled ? (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        </>
      ) : null}

      <form onSubmit={sendMagicLink} className="space-y-3">
        <label className="block">
          <span className="field-label">Email address</span>
          <input
            className="field-input"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {message ? (
        <p
          role="status"
          className={`text-sm ${message.tone === "ok" ? "text-emerald-600" : "text-red-600"}`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
