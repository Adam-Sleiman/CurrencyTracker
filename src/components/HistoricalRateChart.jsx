import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FC_CURRENCIES, fetchHistoricalRateRange } from "../services/freecurrencyApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PERIODS = [
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
];

function getDateRange(months) {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  return {
    dateFrom: from.toISOString().split("T")[0],
    dateTo: to.toISOString().split("T")[0],
  };
}

function HistoricalChart() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [period, setPeriod] = useState("1Y");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (baseCurrency === targetCurrency) {
      setError("Base and target currencies must be different.");
      setChartData(null);
      return;
    }

    const months = PERIODS.find((p) => p.label === period)?.months ?? 12;
    const { dateFrom, dateTo } = getDateRange(months);
    let cancelled = false;

    setLoading(true);
    setError(null);
    setChartData(null);

    fetchHistoricalRateRange(dateFrom, dateTo, baseCurrency, targetCurrency)
      .then((data) => {
        if (cancelled) return;
        const sorted = Object.entries(data).sort(([a], [b]) =>
          a.localeCompare(b)
        );
        if (sorted.length === 0) {
          setError("No historical data available for this currency pair.");
          return;
        }
        const labels = sorted.map(([d]) => d);
        const rates = sorted.map(([, rates]) => rates[targetCurrency]);
        setChartData({ labels, rates, base: baseCurrency, target: targetCurrency });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, targetCurrency, period]);

  const chartConfig = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: `${chartData.base}/${chartData.target}`,
            data: chartData.rates,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.07)",
            borderWidth: 2,
            pointRadius: chartData.labels.length > 90 ? 0 : 3,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.3,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#94a3b8",
        bodyColor: "#f8fafc",
        padding: 10,
        callbacks: {
          label: (ctx) =>
            ` ${ctx.parsed.y.toFixed(5)} ${chartData?.target}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          color: "#94a3b8",
          font: { size: 11 },
        },
        grid: { color: "#f1f5f9" },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
        },
        grid: { color: "#f1f5f9" },
      },
    },
  };

  const minRate = chartData ? Math.min(...chartData.rates) : null;
  const maxRate = chartData ? Math.max(...chartData.rates) : null;
  const latestRate = chartData
    ? chartData.rates[chartData.rates.length - 1]
    : null;
  const earliestRate = chartData ? chartData.rates[0] : null;
  const pctChange =
    earliestRate && latestRate
      ? (((latestRate - earliestRate) / earliestRate) * 100).toFixed(2)
      : null;

  return (
    <section className="hist-chart-card" aria-labelledby="hist-chart-heading">
      <div className="hist-sim-header">
        <span className="hist-sim-icon" aria-hidden="true">📈</span>
        <div>
          <h2 id="hist-chart-heading">Exchange Rate History</h2>
          <p className="hist-sim-description">
            Visualize how a currency pair has moved over time.
          </p>
        </div>
      </div>

      <div className="hist-chart-controls">
        <div className="hist-chart-pair">
          <div className="input-group">
            <label htmlFor="chart-base">Base</label>
            <select
              id="chart-base"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {FC_CURRENCIES.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>

          <div className="hist-chart-arrow" aria-hidden="true">→</div>

          <div className="input-group">
            <label htmlFor="chart-target">Target</label>
            <select
              id="chart-target"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
            >
              {FC_CURRENCIES.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="hist-period-btns"
          role="group"
          aria-label="Select time period"
        >
          {PERIODS.map(({ label }) => (
            <button
              key={label}
              className={`hist-period-btn${period === label ? " active" : ""}`}
              onClick={() => setPeriod(label)}
              aria-pressed={period === label}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <div
        className="hist-chart-canvas"
        role="img"
        aria-label={
          chartData
            ? `Line chart of ${chartData.base} to ${chartData.target} exchange rate over ${period}`
            : "Exchange rate chart"
        }
        aria-busy={loading}
      >
        {loading && (
          <div className="hist-chart-loading" aria-live="polite">
            <div className="hist-chart-spinner" aria-hidden="true" />
            <span>Loading chart data...</span>
          </div>
        )}
        {!loading && chartConfig && (
          <Line data={chartConfig} options={chartOptions} />
        )}
      </div>

      {chartData && (
        <dl className="hist-chart-stats" aria-label="Rate statistics">
          <div className="hist-chart-stat">
            <dt>Latest</dt>
            <dd>{latestRate?.toFixed(5)}</dd>
          </div>
          <div className="hist-chart-stat">
            <dt>High</dt>
            <dd className="stat-high">{maxRate?.toFixed(5)}</dd>
          </div>
          <div className="hist-chart-stat">
            <dt>Low</dt>
            <dd className="stat-low">{minRate?.toFixed(5)}</dd>
          </div>
          <div className="hist-chart-stat">
            <dt>Change</dt>
            <dd
              className={
                pctChange >= 0 ? "stat-positive" : "stat-negative"
              }
            >
              {pctChange >= 0 ? "+" : ""}
              {pctChange}%
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}

export default HistoricalChart;
