import { useState } from "react";
import CurrencyConverter from "../components/CurrencyConverter";
import ConversionHistory from "../components/ConversionHistory";
import FavoritePairs from "../components/FavoritePairs";
import { getHistory } from "../utils/localStorage";

function HomePage() {
  const [history, setHistory] = useState(getHistory());
  const [selectedPair, setSelectedPair] = useState({ from: "USD", to: "SEK" });

  return (
    <div className="home-page">
      <CurrencyConverter onConversion={setHistory} selectedPair={selectedPair} />
      <FavoritePairs onSelect={setSelectedPair} />
      <ConversionHistory history={history} onClear={setHistory} />
    </div>
  );
}

export default HomePage;
