import { useState } from "react";
import { FC_CURRENCIES, fetchHistoricalRate } from "../services/freecurrencyApi";

const today = new Date();
const MAX_DATE = today.toISOString().split("T")[0];
const MIN_DATE = (() => {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 30);
  return d.toISOString().split("T")[0];
})();

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return new Date(+year, +month - 1, +day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function HistoricalSimulation() {
  const [date, setDate] = useState(MAX_DATE);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  }

  async function handleConvert(e) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError("Ange ett giltigt belopp.");
      return;
    }
    if (fromCurrency === toCurrency) {
      setError("Valutorna måste vara olika.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const rate = await fetchHistoricalRate(date, fromCurrency, toCurrency);
      setResult({
        date,
        from: fromCurrency,
        to: toCurrency,
        amount: parsed,
        rate,
        converted: parsed * rate,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="hist-sim-card" aria-labelledby="hist-sim-heading">
      <h2 id="hist-sim-heading">Historisk valutasimulering</h2>
      <p className="hist-subtitle">
        Konvertera med den faktiska växelkursen från valfritt datum upp till 30 år bakåt.
      </p>

      <form
        onSubmit={handleConvert}
        className="hist-sim-form"
        noValidate
        aria-label="Historiskt konverteringsformulär"
      >
        <div className="hist-sim-row">
          <div className="input-group">
            <label htmlFor="hist-date">Datum</label>
            <input
              id="hist-date"
              type="date"
              value={date}
              min={MIN_DATE}
              max={MAX_DATE}
              onChange={(e) => {
                setDate(e.target.value);
                setResult(null);
              }}
              required
              aria-required="true"
            />
          </div>

          <div className="input-group">
            <label htmlFor="hist-amount">Belopp</label>
            <input
              id="hist-amount"
              type="number"
              min="0.01"
              step="any"
              placeholder="Ange belopp..."
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setResult(null);
              }}
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="hist-sim-pair">
          <div className="input-group">
            <label htmlFor="hist-from">Från</label>
            <select
              id="hist-from"
              value={fromCurrency}
              onChange={(e) => {
                setFromCurrency(e.target.value);
                setResult(null);
              }}
            >
              {FC_CURRENCIES.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            aria-label="Byt valutor"
          >
            ⇄
          </button>

          <div className="input-group">
            <label htmlFor="hist-to">Till</label>
            <select
              id="hist-to"
              value={toCurrency}
              onChange={(e) => {
                setToCurrency(e.target.value);
                setResult(null);
              }}
            >
              {FC_CURRENCIES.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="convert-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Konverterar..." : "Konvertera historiskt"}
        </button>
      </form>

      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      {result && (
        <div
          className="result-card hist-sim-result"
          role="region"
          aria-label="Konverteringsresultat"
          aria-live="polite"
        >
          <p className="result-amount">
            {result.amount.toLocaleString("en-US")} {result.from}
          </p>
          <p className="result-equals" aria-hidden="true">
            =
          </p>
          <p className="result-converted">
            {result.converted.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{" "}
            {result.to}
          </p>
          <p className="result-rate">
            1 {result.from} = {result.rate.toFixed(6)} {result.to}
          </p>
          <p className="hist-rate-date">Kurs från {formatDate(result.date)}</p>
        </div>
      )}
    </section>
  );
}

export default HistoricalSimulation;
