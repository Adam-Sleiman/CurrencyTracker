import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">💱</span>
        <span className="navbar-title">CurrencyTracker</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>
            Konvertera
          </NavLink>
        </li>
        <li>
          <NavLink to="/overview">Översikt</NavLink>
        </li>
        <li>
          <NavLink to="/favorites">Favoriter</NavLink>
        </li>
        <li>
          <NavLink to="/history-simulation">Historisk</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
