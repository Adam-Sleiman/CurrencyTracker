import { useState } from "react";

function CurrencyOverview({ currencies }) {
  const [filter, setFilter] = useState("");

  const filteredCurrencies = currencies.filter((currency) =>
    currency.code.toLowerCase().includes(filter.toLowerCase())
  );

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
      <ul className="currency-overview-list">
        {filteredCurrencies.map((currency) => (
          <li key={currency.code} className="currency-overview-item">
            {currency.code}: 1 {currency.code} = {currency.rate} SEK
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrencyOverview;