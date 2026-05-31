import { useEffect, useState } from "react";
import { getFavorites, saveFavorite } from "../utils/favorites";

function CurrencyOverview() {
  const [filter, setFilter] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    async function loadCurrencies() {
      try {
        setLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
        if (!apiKey) {
          throw new Error("Saknar API-nyckel för ExchangeRate-API");
        }

        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/SEK`
        );

        if (!response.ok) {
          throw new Error(`Kunde inte hämta valutor (${response.status})`);
        }

        const data = await response.json();

        if (data.result !== "success" || !data.conversion_rates) {
          throw new Error(data["error-type"] || "Okänt API-fel");
        }

        const currenciesFromApi = Object.entries(data.conversion_rates).map(
          ([code, rate]) => ({ code, rate })
        );

        setCurrencies(currenciesFromApi);
      } catch (loadError) {
        setError(loadError.message || "Kunde inte ladda valutor");
      } finally {
        setLoading(false);
      }
    }

    loadCurrencies();
  }, []);

  function handleSaveFavorite(currencyCode) {
    const updatedFavorites = saveFavorite({ from: currencyCode, to: "SEK" });
    setFavorites(updatedFavorites);
  }

  const filteredCurrencies = currencies.filter((currency) =>
    currency.code.toLowerCase().includes(filter.toLowerCase())
  );

  function isFavorite(currencyCode) {
    return favorites.some(
      (favorite) => favorite.from === currencyCode && favorite.to === "SEK"
    );
  }

  return (
    <div className="currency-overview">
      <h2>Valutaöversikt</h2>
      <input
        className="currency-overview-filter"
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filtrera valuta..."
        aria-label="Filtrera valuta"
      />
      {loading && <p className="currency-overview-status">Laddar valutakurser...</p>}
      {error && <p className="currency-overview-error">Kunde inte ladda valutor: {error}</p>}
      {!loading && !error && (
        <ul className="currency-overview-list">
          {filteredCurrencies.map((currency) => (
            <li
              key={currency.code}
              className={`currency-overview-item ${
                isFavorite(currency.code) ? "currency-overview-item--saved" : ""
              }`}
            >
              <div className="currency-overview-row">
                <span>
                  {currency.code}: 1 {currency.code} = {currency.rate} SEK
                </span>
                <button
                  type="button"
                  className={`currency-overview-save-btn ${
                    isFavorite(currency.code) ? "is-saved" : ""
                  }`}
                  onClick={() => handleSaveFavorite(currency.code)}
                  aria-pressed={isFavorite(currency.code)}
                >
                  {isFavorite(currency.code) ? "★ Sparad" : "Spara"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CurrencyOverview;