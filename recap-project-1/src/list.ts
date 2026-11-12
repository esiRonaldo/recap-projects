import { fetchBooks } from "./api.js";
import { isFavorite, renderFavoriteCount, toggleFavorite } from "./favorite-store.js";
import type { Book } from "./types.js";
import { createCell } from "./components/createCell.js";

const HEART_FILLED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fav"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>`;

const HEART_EMPTY = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="fav"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>`;

const bookList = document.getElementById("book-list");
const bookCount = document.getElementById("book-count");
const searchInput = document.getElementById("search");
const publisherSelect = document.getElementById("by-publisher");
const bookTable = document.getElementById("book-table");

renderFavoriteCount();

function createRow(book: Book): HTMLTableRowElement {
    const row = document.createElement("tr");

    const favCell = document.createElement("td");
    const favButton = document.createElement("button");
    favButton.className = "button button-clear fav-btn";
    favButton.innerHTML = isFavorite(book.isbn) ? HEART_FILLED : HEART_EMPTY;
    favButton.addEventListener("click", () => {
        toggleFavorite(book);
        favButton.innerHTML = isFavorite(book.isbn) ? HEART_FILLED : HEART_EMPTY;
        renderFavoriteCount();
    });
    favCell.append(favButton);

    const detailCell = document.createElement("td");
    const detailLink = document.createElement("a");
    detailLink.href = `detail.html?isbn=${book.isbn}`;
    detailLink.className = "button";
    detailLink.textContent = "Detail";
    detailCell.append(detailLink);

    row.append(
        favCell,
        createCell(book.title),
        createCell(book.isbn),
        createCell(book.author),
        createCell(book.publisher),
        detailCell,
    );
    return row;
}

function renderBooks(books: Book[]): void {
    if (!(bookList instanceof HTMLTableSectionElement)) return;
    if (!(bookCount instanceof HTMLHeadingElement)) return;

    bookList.replaceChildren(...books.map(createRow));
    bookCount.textContent = `${books.length} Books displayed`;
}

function renderPublishers(books: Book[]): void {
    if (!(publisherSelect instanceof HTMLSelectElement)) return;

    const publishers = [...new Set(books.map((book) => book.publisher))].sort(
        (a, b) => a.localeCompare(b),
    );
    const options = publishers.map(
        (publisher) => new Option(publisher, publisher),
    );
    publisherSelect.replaceChildren(new Option("-", "-"), ...options);
}

function showError(message: string): void {
    if (!(bookTable instanceof HTMLTableElement)) return;
    if (!(bookCount instanceof HTMLHeadingElement)) return;

    const error = document.createElement("p");
    error.textContent = message;
    bookTable.replaceWith(error);
    bookCount.textContent = "No books displayed";
}

let books: Book[] = [];

try {
    books = await fetchBooks();
    renderBooks(books);
    renderPublishers(books);
} catch (error) {
    showError(`Books could not be loaded. Please try again later. Error: ${error}`);
}

function applyFilters(): void {
    if (!(searchInput instanceof HTMLInputElement)) return;
    if (!(publisherSelect instanceof HTMLSelectElement)) return;

    const search = searchInput.value.trim().toLowerCase();
    const publisher = publisherSelect.value;

    const filtered = books.filter(
        (book) =>
            book.title.toLowerCase().includes(search) &&
            (publisher === "-" || book.publisher === publisher),
    );
    renderBooks(filtered);
}

if (searchInput instanceof HTMLInputElement) {
    searchInput.addEventListener("input", applyFilters);
    searchInput.form?.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

if (publisherSelect instanceof HTMLSelectElement) {
    publisherSelect.addEventListener("change", applyFilters);
}