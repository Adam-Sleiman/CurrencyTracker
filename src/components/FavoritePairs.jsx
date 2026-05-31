import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/favorites";

function FavoritePairs({ onSelect }) {
  const [favorites, setFavorites] = useState([]);
  const [selectedPairKey, setSelectedPairKey] = useState("");

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleSelect(pair) {
    setSelectedPairKey(`${pair.from}-${pair.to}`);
    if (onSelect) {
      onSelect(pair);
    }
  }

  function handleRemove(pair) {
    const updatedFavorites = removeFavorite(pair);
    setFavorites(updatedFavorites);
    if (selectedPairKey === `${pair.from}-${pair.to}`) {
      setSelectedPairKey("");
    }
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
        {favorites.map((pair) => (
          <li
            key={`${pair.from}-${pair.to}`}
            className={`favorite-pairs-item ${
              selectedPairKey === `${pair.from}-${pair.to}`
                ? "favorite-pairs-item--active"
                : ""
            }`}
          >
            <button
              type="button"
              className="favorite-pairs-select-btn"
              onClick={() => handleSelect(pair)}
            >
              <span>{pair.from} → {pair.to}</span>
              <span className="favorite-pairs-select-label">
                {selectedPairKey === `${pair.from}-${pair.to}` ? "Vald" : "Välj"}
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
        ))}
      </ul>
    </div>
  );
}

export default FavoritePairs;