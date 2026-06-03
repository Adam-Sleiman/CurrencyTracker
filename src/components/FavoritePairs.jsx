import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/favorites";

function FavoritePairs({ onSelect, activePair }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleSelect(pair) {
    if (onSelect) {
      onSelect(pair);
    }
  }

  function handleRemove(pair) {
    const updatedFavorites = removeFavorite(pair);
    setFavorites(updatedFavorites);
  }

  if (favorites.length === 0) {
    return (
      <div className="favorite-pairs">
        <h2>Favoritpar</h2>
        <div className="favorite-pairs-empty-state">
          <div className="favorite-pairs-empty-icon">⭐</div>
          <p className="favorite-pairs-empty">Inga favoriter sparade än</p>
          <p className="favorite-pairs-empty-description">
            Spara ett valutapar från valutaöversikten för att få snabb åtkomst här.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-pairs">
      <h2>Favoritpar</h2>
      <ul className="favorite-pairs-list">
        {favorites.map((pair) => {
          const isActive =
            activePair &&
            activePair.from === pair.from &&
            activePair.to === pair.to;
          return (
          <li
            key={`${pair.from}-${pair.to}`}
            className={`favorite-pairs-item ${
              isActive ? "favorite-pairs-item--active" : ""
            }`}
          >
            <button
              type="button"
              className="favorite-pairs-select-btn"
              onClick={() => handleSelect(pair)}
            >
              <span>{pair.from} → {pair.to}</span>
              <span className="favorite-pairs-select-label">
                {isActive ? "Vald" : "Välj"}
              </span>
            </button>
            <button
              type="button"
              className="favorite-pairs-remove-btn"
              onClick={() => handleRemove(pair)}
            >
              Ta bort
            </button>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FavoritePairs;