import HistoricalSimulator from "../components/HistoricalSimulator";
import HistoricalRateChart from "../components/HistoricalRateChart";

function HistorySimulationPage() {
  return (
    <div className="history-page">
      <HistoricalSimulator />
      <HistoricalRateChart />
    </div>
  );
}

export default HistorySimulationPage;
