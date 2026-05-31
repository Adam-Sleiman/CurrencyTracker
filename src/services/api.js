const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY || "YOUR_API_KEY"}`;

const FALLBACK_SUPPORTED_CODES = [
  ["USD", "United States Dollar"],
  ["EUR", "Euro"],
  ["GBP", "British Pound Sterling"],
  ["SEK", "Swedish Krona"],
  ["NOK", "Norwegian Krone"],
  ["DKK", "Danish Krone"],
  ["JPY", "Japanese Yen"],
  ["CAD", "Canadian Dollar"],
  ["AUD", "Australian Dollar"],
];

function getApiKeyError() {
  return new Error(
    "Saknar API-nyckel. Lägg till VITE_EXCHANGE_RATE_API_KEY i en .env-fil."
  );
}

export async function fetchLatestRates(baseCurrency = "USD") {
  if (!API_KEY) {
    throw getApiKeyError();
  }

  const response = await fetch(`${BASE_URL}/latest/${baseCurrency}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch rates: ${response.status}`);
  }
  const data = await response.json();
  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Unknown API error");
  }
  return data;
}

export async function fetchPairConversion(from, to, amount) {
  if (!API_KEY) {
    throw getApiKeyError();
  }

  const response = await fetch(`${BASE_URL}/pair/${from}/${to}/${amount}`);
  if (!response.ok) {
    throw new Error(`Failed to convert: ${response.status}`);
  }
  const data = await response.json();
  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Unknown API error");
  }
  return data;
}

export async function fetchSupportedCurrencies() {
  if (!API_KEY) {
    return FALLBACK_SUPPORTED_CODES;
  }

  try {
    const response = await fetch(`${BASE_URL}/codes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch currencies: ${response.status}`);
    }
    const data = await response.json();
    if (data.result !== "success") {
      throw new Error(data["error-type"] || "Unknown API error");
    }
    return data.supported_codes;
  } catch {
    return FALLBACK_SUPPORTED_CODES;
  }
}
