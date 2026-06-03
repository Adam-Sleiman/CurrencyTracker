import { useState, useEffect } from "react";
import { fetchSupportedCurrencies, fetchPairConversion } from "../services/api";
import { addToHistory } from "../utils/localStorage";

function CurrencyConverter({ onConversion, selectedPair, onPairChange }) {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("SEK");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedPair?.from) {
      setFromCurrency(selectedPair.from);
      setResult(null);
    }

    if (selectedPair?.to) {
      setToCurrency(selectedPair.to);
      setResult(null);
    }
  }, [selectedPair]);

  useEffect(() => {
    fetchSupportedCurrencies()
      .then((codes) => {
        setCurrencies(codes);
        setCurrenciesLoading(false);
      })
      .catch((err) => {
        setError("Kunde inte ladda valutor: " + err.message);
        setCurrenciesLoading(false);
      });
  }, []);

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    if (onPairChange) {
      onPairChange({ from: toCurrency, to: fromCurrency });
    }
  }

  async function handleCopy() {
    if (!result) return;
    const text = `${result.amount.toLocaleString("sv-SE")} ${result.from} = ${result.result.toLocaleString(
      "sv-SE",
      { minimumFractionDigits: 2, maximumFractionDigits: 4 }
    )} ${result.to}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Kunde inte kopiera till urklipp");
    }
  }

  async function handleConvert(e) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Ange ett giltigt belopp");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const data = await fetchPairConversion(
        fromCurrency,
        toCurrency,
        parseFloat(amount)
      );
      const conversionResult = {
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        result: data.conversion_result,
        rate: data.conversion_rate,
      };
      setResult(conversionResult);
      const updatedHistory = addToHistory(conversionResult);
      if (onConversion) {
        onConversion(updatedHistory);
      }
    } catch (err) {
      setError("Konvertering misslyckades: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="converter-card">
      <h2>Valutakonvertering</h2>
      <form onSubmit={handleConvert} className="converter-form">
        <div className="converter-inputs">
          <div className="input-group">
            <label htmlFor="amount">Belopp</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              placeholder="Ange belopp..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="from-currency">Från</label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => {
                setFromCurrency(e.target.value);
                setResult(null);
                if (onPairChange) {
                  onPairChange({ from: e.target.value, to: toCurrency });
                }
              }}
              disabled={currenciesLoading}
            >
              {currencies.map(([code, name]) => (
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
            <label htmlFor="to-currency">Till</label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => {
                setToCurrency(e.target.value);
                setResult(null);
                if (onPairChange) {
                  onPairChange({ from: fromCurrency, to: e.target.value });
                }
              }}
              disabled={currenciesLoading}
            >
              {currencies.map(([code, name]) => (
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
          disabled={loading || currenciesLoading}
        >
          {loading ? "Konverterar..." : "Konvertera"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="result-card">
          <p className="result-amount">
            {result.amount.toLocaleString("sv-SE")} {result.from}
          </p>
          <p className="result-equals">=</p>
          <p className="result-converted">
            {result.result.toLocaleString("sv-SE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{" "}
            {result.to}
          </p>
          <p className="result-rate">
            1 {result.from} = {result.rate} {result.to}
          </p>
          <button
            type="button"
            className="copy-btn"
            onClick={handleCopy}
            aria-label="Kopiera resultat till urklipp"
          >
            {copied ? "Kopierad!" : "Kopiera"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CurrencyConverter;
