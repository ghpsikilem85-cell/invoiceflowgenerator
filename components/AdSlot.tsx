"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, adSlotId, isPlacementReady, type AdPlacement } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One AdSense unit. Renders nothing at all unless the account and this
 * placement's slot are both configured, so an unapproved or half-configured
 * account leaves no empty space behind.
 */
export default function AdSlot({
  placement,
  className = "",
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isPlacementReady(placement) || pushed.current) return;
    // React 18+ runs effects twice in development; the guard stops AdSense
    // from being handed the same <ins> element two times, which it rejects.
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // A blocked or failed ad must never take the page down with it.
    }
  }, [placement]);

  if (!isPlacementReady(placement)) return null;

  return (
    <aside className={`my-8 ${className}`} aria-label="Advertisement">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">Advertisement</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlotId(placement)}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
