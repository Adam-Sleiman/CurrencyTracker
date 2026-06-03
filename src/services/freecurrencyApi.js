const BASE_URL = "https://api.frankfurter.dev/v2";

export const FC_CURRENCIES = [
  ["AUD", "Australian Dollar"],
  ["BGN", "Bulgarian Lev"],
  ["BRL", "Brazilian Real"],
  ["CAD", "Canadian Dollar"],
  ["CHF", "Swiss Franc"],
  ["CNY", "Chinese Yuan"],
  ["CZK", "Czech Koruna"],
  ["DKK", "Danish Krone"],
  ["EUR", "Euro"],
  ["GBP", "British Pound Sterling"],
  ["HKD", "Hong Kong Dollar"],
  ["HUF", "Hungarian Forint"],
  ["IDR", "Indonesian Rupiah"],
  ["ILS", "Israeli New Shekel"],
  ["INR", "Indian Rupee"],
  ["ISK", "Icelandic Króna"],
  ["JPY", "Japanese Yen"],
  ["KRW", "South Korean Won"],
  ["MXN", "Mexican Peso"],
  ["MYR", "Malaysian Ringgit"],
  ["NOK", "Norwegian Krone"],
  ["NZD", "New Zealand Dollar"],
  ["PHP", "Philippine Peso"],
  ["PLN", "Polish Zloty"],
  ["RON", "Romanian Leu"],
  ["SEK", "Swedish Krona"],
  ["SGD", "Singapore Dollar"],
  ["THB", "Thai Baht"],
  ["TRY", "Turkish Lira"],
  ["USD", "United States Dollar"],
  ["ZAR", "South African Rand"],
];

async function parseResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message ?? `API request failed (${res.status})`);
  }
  return json;
}

// Returns the exchange rate for a single date.
// Frankfurter v2 response: [{date, base, quote, rate}]
export async function fetchHistoricalRate(date, baseCurrency, targetCurrency) {
  const res = await fetch(
    `${BASE_URL}/rates?date=${date}&base=${baseCurrency}&quotes=${targetCurrency}`
  );
  const json = await parseResponse(res);
  const rate = Array.isArray(json) ? json[0]?.rate : null;
  if (rate == null)
    throw new Error(
      "Ingen växelkursdata för detta datum. Prova en vardag eller ett nyare datum."
    );
  return rate;
}

// Returns { "YYYY-MM-DD": { [targetCurrency]: rate }, ... } for chart compatibility.
// Frankfurter v2 response: [{date, base, quote, rate}, ...]
export async function fetchHistoricalRateRange(
  dateFrom,
  dateTo,
  baseCurrency,
  targetCurrency
) {
  const res = await fetch(
    `${BASE_URL}/rates?from=${dateFrom}&to=${dateTo}&base=${baseCurrency}&quotes=${targetCurrency}`
  );
  const json = await parseResponse(res);
  const data = {};
  if (Array.isArray(json)) {
    for (const entry of json) {
      data[entry.date] = { [entry.quote]: entry.rate };
    }
  }
  return data;
}
