# the-book-library
Recap Project 1 - The Book Library
Translate this file ↗
Learning Objectives
Apply TypeScript types, interfaces, and DOM manipulation in a real project
Fetch data from a REST API and render it dynamically without a framework
Filter and search a dataset client-side using TypeScript logic
Persist user data across page reloads using localStorage
Structure a multi-page TypeScript application with separate entry points per page
Share types and functions between pages with ES modules
Check data from an API and from localStorage with type guards
Overview
Up to now the TypeScript sessions have focused on one concept at a time: the type system, the compiler, client-side DOM work. This recap project is where those pieces come together. You build a fully working browser application for a fictional public library, entirely in TypeScript, without a UI framework.

The data comes from a local REST API provided by the bookmonkey-api package. You run it alongside your app, fetch the book catalog from it, and use the data to drive three pages: a filterable book listing, a detail page for each book, and a favorites list the user builds up over time.

The listing page is the main entry point. It shows every book in a table and lets the user narrow the results either by typing into a search field or picking a publisher from a dropdown. Both filters work at the same time. Each row links to the book’s detail page, which pulls the ISBN from the URL and fetches only that book’s data from the API.

The favorites feature runs entirely in the browser. The user marks a book as a favorite from the listing view, and the header updates immediately to show the current count. The favorites page lists the saved books and lets the user remove them. Because favorites are stored in localStorage, they survive a page refresh.

There are no starter components to fill in. The HTML templates are pre-built and waiting in the project folder. Your job is to write a TypeScript entry file for each page that reads the DOM, calls the API, and wires up the interactions, plus a few modules that all pages share.

# Recap Project 1 - The Book Library
Translate this file ↗
Introduction
The customer is a public library in the fictitious town of Foobar. The library wants to put its catalog online, so that readers can browse the books and keep a list of their favorites. It is your task to create this app for the customer.

Prerequisites
Starter files
Download the starter files for this challenge with:

npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-1 recap-project-1

The project folder contains three HTML pages and a stylesheet: index.html lists the books, detail.html shows a single book, and favorite.html shows the favorites. Their sample rows show what the pages look like with data.

REST API
The book data comes from the bookmonkey-api package. Start it in its own terminal and keep it running:

npx bookmonkey-api@4

The API runs at http://localhost:4730.
GET /books returns all books, GET /books/{isbn} returns a single book.
The interactive documentation at http://localhost:4730/api shows all endpoints and the fields of a book. Use it to write your types.
HTML pages
Use the HTML pages as they are and add your TypeScript. You may change the HTML, for example to add id attributes and the <script> tags, but keep its structure and classes, so that the styling still works.

Tasks
Use plain TypeScript for the DOM, without a framework or component library. A few rules apply to the whole project:

Each page has its own entry file in src, for example src/list.ts for index.html.
Code that more than one page needs, like your types, the API calls, and the favorites storage, lives in its own modules, which the entry files import.
Data from the API and from localStorage is checked with type guards. No any, and no as for this data.
Challenge
0/3
Setup

Install TypeScript locally and create a tsconfig.json for the browser that compiles src into dist

Add a <script type="module"> to each HTML page that loads its entry file from dist

Run npx tsc --watch and a local web server, for example npx http-server -c-1, next to the API
Done when
Each page logs a message from its own entry file in the browser console.

Challenge
0/8
Book listing

A Book interface with the fields you need, and a type guard isBook

A function fetchBooks(): Promise<Book[]> that checks response.ok and returns only valid books

The table shows all books, one row per book with title, ISBN, author, and publisher

The heading shows how many books are displayed

A search field filters the books by title

The publisher dropdown lists every publisher from the data, and choosing one shows only its books

Search and publisher filter work at the same time

When the API is not reachable, the page shows an error message instead of an empty table
Done when
Searching for “harry” with the publisher “Bloomsbury” shows seven books, and with the API stopped, the page shows your error message.

Challenge
0/4
Detail page

The “Detail” link in each row opens detail.html?isbn=… for its book

The detail page reads the ISBN from the URL with URLSearchParams and fetches only this book

It shows the title, the subtitle if the book has one, the abstract, author, publisher, number of pages, and the cover

For an unknown ISBN, the page shows an error message
Done when
The detail page of “Sapiens” shows its subtitle, “Dune” shows none, and detail.html?isbn=123 shows your error message.

Challenge
0/5
Favorites

The heart button in each row of the listing adds a book to the favorites or removes it again. A filled heart marks a favorite.

Favorites are stored in localStorage as Pick<Book, …> with only the fields the favorites table needs

When you read them back, a type guard checks every entry

The header shows the number of favorites on every page

favorite.html lists all favorites, and the button in each row removes a book from the list
Done when
After a reload, the header and the favorites page still show the same books, and a book you remove on the favorites page has an empty heart again in the listing.

Hint
Bonus
The bonus tasks are independent of each other. Pick the one that interests you most.

Challenge
0/2
Filter the favorites

Search and publisher filter on favorite.html work like on the listing page

Both pages use the same filter function from a shared module
Done when
On the favorites page, the dropdown lists only the publishers of your favorites, and the search works.

Many books belong to a series. predecessorIsbn and successorIsbn contain the ISBN of the previous and the next volume, or null if there is none.

Challenge
0/2
Series navigation

Add both fields to Book with the type string | null and check them in isBook

On the detail page, show a link “Previous volume” or “Next volume” only if the field is not null
Done when
“Harry Potter and the Chamber of Secrets” links to both neighbors, “Harry Potter and the Philosopher’s Stone” only to the next volume, and “Sapiens” shows no link.

Challenge
0/3
Sortable table

A click on the column headers Title, ISBN, Author, or Publisher sorts the table by that column. A second click on the same header reverses the order.

Write a generic function sortBy<T, K extends keyof T>(items: T[], key: K): T[] that returns a sorted copy, and use it for the sorting

Sorting keeps the current search and publisher filter
Done when
A click on “Author” lists “Aldous Huxley” first, a second click lists “Yuval Noah Harari” first.

Challenge
0/2
Prices

Add price and currency to Book. Type currency as a union of the five currencies from the API documentation, and check it in isBook

Show the price on the detail page, formatted with Intl.NumberFormat
Done when
The detail page of “Atomic Habits” shows the price in euros, for example as €21.99.