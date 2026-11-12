import { isFavoriteBook, type FavoriteBook } from "./types.js";

const STORAGE_KEY = "favorites";

function loadFavorites(): FavoriteBook[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (typeof stored !== "string") return [];

    const data: unknown = JSON.parse(stored);
    if (!Array.isArray(data)) return [];

    return data.filter(isFavoriteBook);
  } catch (error) {
    console.error(error);
    return [];
  }
}

let favorites: FavoriteBook[] = loadFavorites();

function saveFavorites(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error(error);
  }
}

export function getFavorites(): FavoriteBook[] {
  return favorites;
}

export function isFavorite(isbn: string): boolean {
  return favorites.some((favorite) => favorite.isbn === isbn);
}

export function renderFavoriteCount(): void {
  const count = document.getElementById("favorite-count");
  if (!(count instanceof HTMLSpanElement)) return;

  count.textContent = String(favorites.length);
}

export function toggleFavorite(book: FavoriteBook): void {
  if (isFavorite(book.isbn)) {
    favorites = favorites.filter((favorite) => favorite.isbn !== book.isbn);
  } else {
    const favorite: FavoriteBook = {
      title: book.title,
      isbn: book.isbn,
      author: book.author,
      publisher: book.publisher,
    };
    favorites = [...favorites, favorite];
  }
  saveFavorites();
}
