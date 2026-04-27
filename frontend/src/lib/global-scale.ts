/**
 * VIRAIL Global Scale Engine
 * Multi-currency, timezone-aware, and localization utilities.
 * Powers international expansion into LATAM, India, EU, and US markets.
 */

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CURRENCY
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "INR" | "BRL";

export const CURRENCY_CONFIG: Record<SupportedCurrency, {
  symbol: string;
  locale: string;
  exchangeRate: number; // Relative to USD
}> = {
  USD: { symbol: "$",  locale: "en-US", exchangeRate: 1 },
  EUR: { symbol: "â‚¬",  locale: "de-DE", exchangeRate: 0.92 },
  GBP: { symbol: "Â£",  locale: "en-GB", exchangeRate: 0.79 },
  INR: { symbol: "â‚¹",  locale: "en-IN", exchangeRate: 83.5 },
  BRL: { symbol: "R$", locale: "pt-BR", exchangeRate: 4.97 },
};

export function formatCurrency(
  amountUSD: number,
  currency: SupportedCurrency = "USD"
): string {
  const config = CURRENCY_CONFIG[currency];
  const converted = amountUSD * config.exchangeRate;
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REGION-BASED PRICING
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type Region = "US" | "EU" | "IN" | "LATAM" | "UK";

export const REGIONAL_PRICING: Record<Region, {
  currency: SupportedCurrency;
  starterMonthly: number;
  proMonthly: number;
  agencyMonthly: number;
  discount: string; // Annual discount messaging
}> = {
  US: {
    currency: "USD",
    starterMonthly: 49,
    proMonthly: 99,
    agencyMonthly: 299,
    discount: "Save $240/yr with Annual"
  },
  EU: {
    currency: "EUR",
    starterMonthly: 45,
    proMonthly: 89,
    agencyMonthly: 269,
    discount: "Save â‚¬216/yr with Annual"
  },
  UK: {
    currency: "GBP",
    starterMonthly: 39,
    proMonthly: 79,
    agencyMonthly: 239,
    discount: "Save Â£192/yr with Annual"
  },
  IN: {
    currency: "INR",
    starterMonthly: 1999,
    proMonthly: 3999,
    agencyMonthly: 12999,
    discount: "Save â‚¹24,000/yr with Annual"
  },
  LATAM: {
    currency: "BRL",
    starterMonthly: 199,
    proMonthly: 399,
    agencyMonthly: 1299,
    discount: "Save R$2,400/yr with Annual"
  },
};

export function getPricingForRegion(region: Region) {
  return REGIONAL_PRICING[region];
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TIMEZONE INTELLIGENCE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const TIMEZONE_REGIONS: Record<string, string[]> = {
  "US/Eastern":  ["America/New_York", "America/Toronto"],
  "US/Pacific":  ["America/Los_Angeles", "America/Vancouver"],
  "EU/Central":  ["Europe/Berlin", "Europe/Paris", "Europe/Madrid"],
  "EU/London":   ["Europe/London"],
  "IN/Kolkata":  ["Asia/Kolkata"],
  "LATAM/Sao":   ["America/Sao_Paulo"],
};

/**
 * Converts a UTC posting hour to local time for display.
 */
export function toLocalHour(utcHour: number, timezone: string): number {
  const now = new Date();
  now.setUTCHours(utcHour, 0, 0, 0);
  const local = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  return local.getHours();
}

/**
 * Returns a user-friendly "Best Time to Post" string for a given timezone.
 */
export function getBestPostingWindow(
  platform: "TIKTOK" | "YOUTUBE_SHORTS" | "INSTAGRAM_REELS",
  timezone: string
): string {
  // Peak windows in UTC
  const utcPeakWindows: Record<string, number[]> = {
    TIKTOK:           [12, 17, 19], // UTC
    YOUTUBE_SHORTS:   [13, 16, 18],
    INSTAGRAM_REELS:  [13, 17, 19],
  };

  const peaks = utcPeakWindows[platform] || [17];
  const localPeaks = peaks.map(h => {
    const local = toLocalHour(h, timezone);
    const period = local >= 12 ? "PM" : "AM";
    const display = local > 12 ? local - 12 : local || 12;
    return `${display}${period}`;
  });

  return localPeaks.join(", ");
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SEO: hreflang helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const SUPPORTED_LOCALES = ["en", "es", "hi", "pt"];

export function buildHreflangTags(path: string): string {
  return SUPPORTED_LOCALES.map(locale =>
    `<link rel="alternate" hreflang="${locale}" href="https://virail.com/${locale}${path}" />`
  ).join("\n");
}

/**
 * Maps a user's browser locale to a VIRAIL region.
 */
export function detectRegionFromLocale(locale: string): Region {
  if (locale.startsWith("en-IN")) return "IN";
  if (locale.startsWith("en-GB")) return "UK";
  if (locale.startsWith("pt"))    return "LATAM";
  if (locale.startsWith("es"))    return "LATAM";
  if (["de", "fr", "it", "nl", "pl"].some(l => locale.startsWith(l))) return "EU";
  return "US";
}
