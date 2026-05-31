const FAVORITES_KEY = "currencytracker_favorites";

function readFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export function getFavorites() {
  return readFavorites();
}

export function saveFavorite(pair) {
  const favorites = readFavorites();
  const exists = favorites.some(
    (favorite) => favorite.from === pair.from && favorite.to === pair.to
  );

  if (exists) {
    return favorites;
  }

  favorites.push(pair);
  return writeFavorites(favorites);
}

export function removeFavorite(pair) {
  const favorites = readFavorites().filter(
    (favorite) => !(favorite.from === pair.from && favorite.to === pair.to)
  );

  return writeFavorites(favorites);
}