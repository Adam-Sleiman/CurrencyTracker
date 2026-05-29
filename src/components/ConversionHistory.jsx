import { clearHistory } from "../utils/localStorage";

function ConversionHistory({ history, onClear }) {
  function handleClear() {
    clearHistory();
    if (onClear) {
      onClear([]);
    }
  }

  if (history.length === 0) {
    return (
      <div className="history-card">
        <h2>Konverteringshistorik</h2>
        <p className="history-empty">Inga konverteringar ännu.</p>
      </div>
    );
  }

  return (
    <div className="history-card">
      <div className="history-header">
        <h2>Konverteringshistorik</h2>
        <button className="clear-btn" onClick={handleClear}>
          Rensa
        </button>
      </div>
      <ul className="history-list">
        {history.map((entry, index) => (
          <li key={index} className="history-item">
            <div className="history-conversion">
              <span className="history-amount">
                {entry.amount.toLocaleString("sv-SE")} {entry.from}
              </span>
              <span className="history-arrow">→</span>
              <span className="history-result">
                {entry.result.toLocaleString("sv-SE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                })}{" "}
                {entry.to}
              </span>
            </div>
            <span className="history-time">
              {new Date(entry.timestamp).toLocaleString("sv-SE")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversionHistory;
