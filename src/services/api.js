const API_KEY = "YOUR_API_KEY";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export async function fetchLatestRates(baseCurrency = "USD") {
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
  const response = await fetch(`${BASE_URL}/codes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.status}`);
  }
  const data = await response.json();
  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Unknown API error");
  }
  return data.supported_codes;
}
