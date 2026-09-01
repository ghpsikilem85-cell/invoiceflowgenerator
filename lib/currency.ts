export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE" },
  { code: "AED", symbol: "AED", name: "UAE Dirham", locale: "en-AE" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", locale: "es-MX" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ" },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code: string): Currency {
  return BY_CODE.get(code) ?? CURRENCIES[0];
}

/**
 * Formats using Intl when the runtime knows the currency, and falls back to a
 * plain symbol + fixed decimals so PDF rendering never throws on odd codes.
 */
export function formatMoney(amount: number, code: string): string {
  const currency = getCurrency(code);
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}

export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
