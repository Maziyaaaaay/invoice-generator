export interface CurrencyOption {
  code: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "INR", symbol: "₹", locale: "en-IN" },
  { code: "AED", symbol: "AED", locale: "en-AE" },
  { code: "USD", symbol: "$", locale: "en-US" },
  { code: "EUR", symbol: "€", locale: "de-DE" },
  { code: "GBP", symbol: "£", locale: "en-GB" },
  { code: "SGD", symbol: "S$", locale: "en-SG" },
  { code: "AUD", symbol: "A$", locale: "en-AU" },
  { code: "CAD", symbol: "C$", locale: "en-CA" },
  { code: "JPY", symbol: "¥", locale: "ja-JP" },
  { code: "CHF", symbol: "CHF", locale: "de-CH" },
  { code: "SEK", symbol: "kr", locale: "sv-SE" },
  { code: "ZAR", symbol: "R", locale: "en-ZA" },
  { code: "NZD", symbol: "NZ$", locale: "en-NZ" },
  { code: "MYR", symbol: "RM", locale: "ms-MY" },
];

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${currency.symbol} ${(Number(amount) || 0).toFixed(2)}`;
  }
}
