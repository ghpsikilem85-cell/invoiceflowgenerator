import { formatMoney, getCurrency } from "@/lib/currency";

/** Characters outside Latin-1 that Helvetica's WinAnsi encoding still covers. */
const EXTRA_WIN_ANSI = new Set([0x20ac, 0x2018, 0x2019, 0x201c, 0x201d, 0x2013, 0x2014]);

function isWinAnsiSafe(value: string): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const latin1 = code >= 0x20 && code <= 0xff;
    if (!latin1 && !EXTRA_WIN_ANSI.has(code)) return false;
  }
  return true;
}

/**
 * Free text (business names, notes) can contain glyphs Helvetica has no
 * outline for — Turkish dotless i, Polish crossed l, CJK. Decomposing and
 * dropping the combining marks keeps `Gökhan` readable as `Gokhan` instead of
 * punching holes in the PDF. Register a Unicode TTF with `Font.register` to
 * lift this restriction.
 */
export function pdfText(value: string): string {
  if (isWinAnsiSafe(value)) return value;
  const folded = value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");
  return Array.from(folded)
    .filter((char) => isWinAnsiSafe(char))
    .join("");
}

/**
 * The PDF uses the standard Helvetica face, which only carries WinAnsi
 * glyphs. Symbols outside that set (Turkish lira, rupee and friends) would
 * render as blanks, so anything unsafe falls back to `1,500.00 TRY`.
 */
export function formatMoneyPdf(amount: number, code: string): string {
  const formatted = formatMoney(amount, code);
  if (isWinAnsiSafe(formatted)) return formatted;

  const currency = getCurrency(code);
  const number = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${number} ${currency.code}`;
}
