/**
 * Google AdSense wiring. Everything here is inert until
 * NEXT_PUBLIC_ADSENSE_CLIENT is set, so the site ships without ads and gains
 * them the moment AdSense approves the account.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export const isAdsEnabled = /^ca-pub-\d+$/.test(ADSENSE_CLIENT);

/**
 * Slot IDs come from the AdSense dashboard after you create each ad unit. A
 * placement with no slot renders nothing rather than an empty grey box.
 */
export const AD_SLOTS = {
  /** Inside a blog article, after the opening section. */
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? "",
  /** Below the long-form copy on a tool or landing page. */
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT ?? "",
} as const;

export type AdPlacement = keyof typeof AD_SLOTS;

export function adSlotId(placement: AdPlacement): string {
  return AD_SLOTS[placement];
}

export function isPlacementReady(placement: AdPlacement): boolean {
  return isAdsEnabled && adSlotId(placement).length > 0;
}
