const CURRENCIES = ["EUR", "USD", "GBP", "CNY", "RUB"] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface Book {
  title: string;
  subtitle?: string;
  isbn: string;
  abstract: string;
  author: string;
  publisher: string;
  numPages: number;
  cover: string;
  price: number;
  currency: Currency;
  predecessorIsbn: string | null;
  successorIsbn: string | null;
}

export type FavoriteBook = Pick<Book, "title" | "isbn" | "author" | "publisher">;

function isCurrency(value: unknown): value is Currency {
  return CURRENCIES.some((currency) => currency === value);
}


export function isBook(value: unknown): value is Book {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof value.title === "string" &&
    (!("subtitle" in value) || typeof value.subtitle === "string") &&
    "isbn" in value &&
    typeof value.isbn === "string" &&
    "abstract" in value &&
    typeof value.abstract === "string" &&
    "author" in value &&
    typeof value.author === "string" &&
    "publisher" in value &&
    typeof value.publisher === "string" &&
    "numPages" in value &&
    typeof value.numPages === "number" &&
    "cover" in value &&
    typeof value.cover === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    "currency" in value &&
    isCurrency(value.currency) &&
    "predecessorIsbn" in value &&
    (typeof value.predecessorIsbn === "string" || value.predecessorIsbn === null) &&
    "successorIsbn" in value &&
    (typeof value.successorIsbn === "string" || value.successorIsbn === null)
  );
}

export function isFavoriteBook(value: unknown): value is FavoriteBook {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof value.title === "string" &&
    "isbn" in value &&
    typeof value.isbn === "string" &&
    "author" in value &&
    typeof value.author === "string" &&
    "publisher" in value &&
    typeof value.publisher === "string"
  );
}
