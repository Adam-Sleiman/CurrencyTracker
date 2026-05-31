import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/favorites";

function FavoritePairs() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemove(pair) {
    const updatedFavorites = removeFavorite(pair);
    setFavorites(updatedFavorites);
  }

  if (favorites.length === 0) {
    return (
      <div className="favorite-pairs">
        <h2>Favoritpar</h2>
        <p className="favorite-pairs-empty">Inga favoriter sparade än</p>
      </div>
    );
  }

  return (
    <div className="favorite-pairs">
      <h2>Favoritpar</h2>
      <ul className="favorite-pairs-list">
        {favorites.map((pair) => (
          <li key={`${pair.from}-${pair.to}`} className="favorite-pairs-item">
            <span>{pair.from} → {pair.to}</span>
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