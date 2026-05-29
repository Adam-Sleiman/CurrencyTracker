import { useState } from "react";
import CurrencyConverter from "../components/CurrencyConverter";
import ConversionHistory from "../components/ConversionHistory";
import { getHistory } from "../utils/localStorage";

function HomePage() {
  const [history, setHistory] = useState(getHistory());

  return (
    <div className="home-page">
      <CurrencyConverter onConversion={setHistory} />
      <ConversionHistory history={history} onClear={setHistory} />
    </div>
  );
}

export default HomePage;
