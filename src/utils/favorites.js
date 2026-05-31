const FAVORITES_KEY = "currencytracker_favorites";

function readFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    const favorites = data ? JSON.parse(data) : [];
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
    } catch {
    }
    return [];
  }
}

function writeFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  } catch {
    return [];
  }
}

export function getFavorites() {
  return readFavorites();
}

export function saveFavorite(pair) {
  try {
    const favorites = readFavorites();
    const exists = favorites.some(
      (favorite) => favorite.from === pair.from && favorite.to === pair.to
    );

    if (exists) {
      return favorites;
    }

    favorites.push(pair);
    return writeFavorites(favorites);
  } catch {
    return writeFavorites([]);
  }
}

export function removeFavorite(pair) {
  try {
    const favorites = readFavorites().filter(
      (favorite) => !(favorite.from === pair.from && favorite.to === pair.to)
    );

    return writeFavorites(favorites);
  } catch {
    return writeFavorites([]);
  }
}