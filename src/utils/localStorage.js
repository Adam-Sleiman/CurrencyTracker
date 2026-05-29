const HISTORY_KEY = "currencytracker_history";
const FAVORITES_KEY = "currencytracker_favorites";
const MAX_HISTORY = 10;

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry) {
  const history = getHistory();
  history.unshift({
    ...entry,
    timestamp: new Date().toISOString(),
  });
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  return [];
}

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(pair) {
  const favorites = getFavorites();
  const exists = favorites.some(
    (f) => f.from === pair.from && f.to === pair.to
  );
  if (!exists) {
    favorites.push(pair);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
}

export function removeFavorite(pair) {
  let favorites = getFavorites();
  favorites = favorites.filter(
    (f) => !(f.from === pair.from && f.to === pair.to)
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}
