import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OverviewPage from "./pages/OverviewPage";
import FavoritesPage from "./pages/FavoritesPage";
import HistorySimulationPage from "./pages/HistorySimulationPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/history-simulation" element={<HistorySimulationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
