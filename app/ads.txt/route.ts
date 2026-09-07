import { ADSENSE_CLIENT, isAdsEnabled } from "@/lib/ads";

/**
 * AdSense requires an ads.txt naming every network authorised to sell this
 * site's inventory. Without it Google marks the inventory unauthorised and
 * most demand disappears.
 */
export function GET() {
  if (!isAdsEnabled) {
    return new Response("", { status: 404 });
  }

  // ca-pub-1234 -> pub-1234, which is the form ads.txt expects.
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, "");

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
