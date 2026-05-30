import CurrencyOverview from "../components/CurrencyOverview";

const testCurrencies = [
  { code: "USD", rate: 10.5 },
  { code: "EUR", rate: 11.2 },
  { code: "GBP", rate: 13.1 },
];

function OverviewPage() {
  return <CurrencyOverview currencies={testCurrencies} />;
}

export default OverviewPage;
