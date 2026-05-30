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
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filtrera valuta..."
        aria-label="Filtrera valuta"
      />
      <ul>
        {filteredCurrencies.map((currency) => (
          <li key={currency.code}>
            {currency.code}: 1 {currency.code} = {currency.rate} SEK
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrencyOverview;