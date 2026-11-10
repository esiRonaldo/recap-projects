# Recap Project 2 - Trail Guide
Translate this file ↗
Learning Objectives
Combine routing, middleware, MVC, Nunjucks, and SQLite into a single working application
Serve HTML pages and JSON responses from the same Express app and the same model layer
Use a one-to-many relationship in SQLite and read it back with an INNER JOIN
Protect write endpoints on a public API with a header-based key check
Sanitize HTML from forms before you store and render it
Style a semantic HTML site with pico.css and no custom utility classes
Overview
Up to now, each backend session has focused on one layer at a time: HTTP and Express, then templates, then middleware, then MVC, then SQL. In this retrospective project, we will bring these different layers together.

The project is about a small guidebook of walking routes called ‘Trail Guide’. Visitors browse trails on a public website. An admin user manages the catalog through a separate set of routes with HTML forms. External developers can read and write data through a JSON API at /api. All three surfaces share the same Express app, the same SQLite database, and the same model functions. Only the controllers and the response format change.

The data model consists of two tables. A regions table holds the area each trail belongs to, like “Bavarian Alps” or “Scottish Highlands”. A trails table holds individual trails and references its region through a foreign key. This ‘one-to-many’ relationship allows you to establish a link: every trail page and every API response that returns a trail also includes the name of the region and the country.

For the styling, we will use a minimalistic, classless CSS framework called pico.css. Add it once via a CDN link in your base template, then write plain semantic HTML, like <header>, <nav>, <article>, <form>, and <table>. There is no design work to do beyond writing correct markup.

The project is divided into four sections: setup and database, public website, admin area, and public API. Work through these in order. Each part depends on the previous one having been completed.

Translate this file ↗
Prerequisites
Seed data
The schema and the sample data come as a SQL file. Download it into the data folder of your project:

npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-2 data

data/seed.sql creates the tables regions and trails and fills them with three regions and six trails. Running it again resets the database to this state. The folder also contains the empty database file trail-guide.db.

Tools
Bun, set up as in Backend Basics and Express. Node with tsx works as well, as shown in the environment variables handout.
The sqlite3 command line tool, which runs the seed file. macOS ships with it. If your system does not have it, open data/trail-guide.db in DB Browser for SQLite and run the contents of seed.sql in the “Execute SQL” tab.
A REST client like Bruno, to test the API.
Rules for the whole project
Routers only map paths to named controller functions. The controllers read the request and send the response.
Only the model files run SQL. Every value from the URL, the query string, or a request body goes into the query as a ? parameter, never into the SQL string.
Templates get data that is ready to show. Formatting, like turning created_at into a readable date, happens in a util function that the controller calls.
1 Database and Setup
The goal of this part is to get a project skeleton running with a connected database, a working Nunjucks layout styled by pico.css, and a seeded SQLite file. By the end you should be able to run the dev server and see a “hello” page rendered through your base template, with the database open and ready for queries.

Challenge
0/5
Project setup

Create the project with bun init and move the entry file to src/app.ts

Install express, nunjucks, sqlite, sqlite3, and sanitize-html, plus @types/express, @types/nunjucks, and @types/sanitize-html as dev dependencies

Add the scripts dev (bun --watch --check src/app.ts), typecheck (bun check), and db:seed (sqlite3 data/trail-guide.db < data/seed.sql)

Create an .env with PORT, DB_PATH, and API_KEY, and a committed .env.example with the same names but without the real key

Create the folders below, so the rest of the project has somewhere to land
Done when
bun run dev starts the server, bun run typecheck reports no errors, and git status does not list .env.

src/
  app.ts
  routes/
  controllers/
  models/
  middleware/
views/
  macros/
  admin/
public/
data/

Bun loads .env on its own. The .gitignore that bun init creates already lists .env and the logs folder you need in part 2.

Challenge
0/4
Base layout with pico.css

views/base.html has a <header> with links to the trails, the regions, and the admin panel, a <main> with a content block, and a <footer>

pico.css is loaded from its CDN in the <head>: https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css

Nunjucks is configured against the views/ folder, with html as the view engine

public/ is served as a static folder for images or extra CSS you add later
Done when
A temporary GET / that renders a page extending base.html shows your header and footer in the pico.css style.

Hint
Refer to Backend Server-Side Rendering for the extends/block setup.

Challenge
0/5
Database connection

Read data/seed.sql: which tables does it create, and which column connects them?

bun run db:seed fills the database

src/models/db.ts exports connectDB, getDB, and closeDB and reads the file path from process.env.DB_PATH

connectDB turns on foreign key checks with PRAGMA foreign_keys = ON

app.ts awaits connectDB() before app.listen(), and handlers for SIGINT and SIGTERM call closeDB() before the process exits
Done when
The server starts without errors, and Ctrl+C prints your shutdown message before the process ends.

The seed file creates the tables, so connectDB does not need a CREATE TABLE IF NOT EXISTS statement. Refer to Backend SQL Basics for the connection module shape and the shutdown handlers, and to Backend SQL Advanced for the foreign key check.

2 Website
The goal of this part is the read-only public site. By the end, anyone visiting the root URL can browse all trails, click into a trail detail page, and browse trails grouped by region. Every page extends the same base layout. Trail listings reuse a single Nunjucks macro.

Challenge
0/8
Trail pages

Types for a region, a trail, and a trail joined with its region, which adds region_name and region_country

models/trailModel.ts exports getAllTrails(), newest first, and getTrailBySlug(slug). Both join regions with an INNER JOIN on trails.region_id.

routes/websiteRoutes.ts is mounted at the root path and maps GET / and GET /trails/:slug to named functions in controllers/trailController.ts. The route params are typed with Request<{ slug: string }>.

The macro trailCard(trail) in views/macros/trailCard.html renders one trail as an <article> with its title, a difficulty badge, the distance, the region, and a link to its detail page

views/index.html lists all trails with this macro

views/trail.html shows the title, region and country, difficulty, distance, image, description, and the date the trail was added

A util function turns created_at, a Unix timestamp in seconds, into a readable date

An unknown slug gets status 404 and a page that says so
Done when
The home page shows six trail cards with “Seceda Ridgeline” first. /trails/zugspitze-via-reintal shows “Bavarian Alps”, “Germany”, “21 km”, and the date 7 November 2024 in a format of your choice, and /trails/nope shows your 404 page.

Hint
Challenge
0/4
Region pages

models/regionModel.ts exports getAllRegions() and getRegionBySlug(slug), and trailModel.ts gets getTrailsByRegionId(regionId)

GET /regions lists all regions with their country, each linking to its page. The controllers live in controllers/regionController.ts.

GET /regions/:slug shows the region’s name, country, and description, and its trails with the same trailCard macro

An unknown region slug gets status 404
Done when
/regions lists three regions, /regions/dolomites shows two trail cards, and /regions/nope shows your 404 page.

Refer to Backend SQL Basics for the typed db.all<T[]> and db.get<T> patterns, to Backend SQL Advanced for INNER JOIN syntax, to Backend MVC Pattern for the controller signature and the routes-to-controller mapping, and to Backend Server-Side Rendering for macros and extends/block.

Challenge
0/2
Request logger

middleware/logger.ts appends one line per request to logs/access.log after the response has finished, with timestamp, method, URL, and status code

It is registered in app.ts before the routers, so it also logs the admin and API requests you add later
Done when
After you open /, /regions, and /trails/nope, the end of logs/access.log lists these three requests with the status codes 200, 200, and 404.

Refer to Backend Express Advanced for the logger middleware example with res.on("finish", ...).

3 Admin Panel
The goal of this part is HTML-form-based CRUD for trails. By the end, an editor can list, create, edit, and delete trails through a separate set of pages mounted at /admin. The admin panel reuses the model functions from part 2 and adds three more for the write paths.

Challenge
0/3
Admin list and delete

routes/adminRoutes.ts is mounted at /admin, with its controllers in controllers/adminController.ts

GET /admin shows all trails in a table, with an edit link and a delete button in each row

deleteTrail(id) in trailModel.ts, and POST /admin/trails/:id/delete calls it and redirects back to /admin
Done when
Deleting “Partnach Gorge Loop” removes it from the admin table and from the home page, and bun run db:seed brings it back.

Challenge
0/6
Create and edit trails

trailModel.ts gets getTrailById(id), addTrail(data), and updateTrail(id, data). Both write functions build the slug from the title, so a new title also gets a new slug.

GET /admin/trails/new and POST /admin/trails create a trail, GET /admin/trails/:id/edit and POST /admin/trails/:id update one. Each POST redirects to /admin after the model call succeeds.

One template, views/admin/form.html, serves both. Its region dropdown lists the regions from the database, and the edit form preselects the trail’s region and difficulty.

express.urlencoded({ extended: true }) fills req.body for form submissions

Every description goes through sanitize-html before it reaches the model. Allow only the tags a trail description needs, like p, strong, em, ul, ol, li, and a.

A form with an empty title or distance is shown again with an error message instead of being saved
Done when
A new trail “Eibsee Loop” in the Bavarian Alps shows up at /trails/eibsee-loop and on /regions/bavarian-alps. A <script> tag in its description does not appear in the page source. Renaming it to “Eibsee Circuit” moves its page to /trails/eibsee-circuit.

Hint
Refer to Backend MVC Pattern’s admin CRUD challenge for the same pattern applied to a blog. The shape is identical here, only the entity changes.

4 Public REST API
The goal of this part is the JSON surface at /api. Read endpoints are open to anyone. Write endpoints require an x-api-key header that matches the value in .env. Controllers reuse the same model functions you already wrote. Only the response format changes.

Challenge
0/5
Read endpoints

routes/apiRoutes.ts is mounted at /api, with its controllers in controllers/apiTrailController.ts and controllers/apiRegionController.ts

GET /api/trails returns all trails, each joined with its region

GET /api/trails/:slug returns one trail, or 404 with a JSON error

GET /api/regions returns all regions

GET /api/regions/:slug/trails returns the trails of one region, or 404 if the region does not exist
Done when
In your REST client, GET /api/trails returns six trails, GET /api/trails/old-man-of-storr contains "region_country": "United Kingdom", and GET /api/regions/nope/trails answers with 404 and a JSON error.

Challenge
0/7
Write endpoints with an API key

express.json() parses JSON bodies

middleware/apiKey.ts compares the x-api-key header with process.env.API_KEY. A missing or wrong key gets 401 and a JSON error, otherwise the middleware calls next().

The middleware runs only on the write routes. Attach it directly to their route definitions in apiRoutes.ts.

POST /api/trails creates a trail from a JSON body and answers with 201 and the new trail

PUT /api/trails/:id replaces a trail and answers with 200 and the updated trail, or 404

DELETE /api/trails/:id answers with 204 and no body, or 404

POST and PUT reject a body with a missing field, an unknown difficulty, or a region_id that matches no region with 400 and a JSON error. A field-by-field check is enough, you do not need a validation library.
Done when
Without the header, DELETE /api/trails/1 answers with 401. With the key, a POST without difficulty gets 400, a complete one gets 201 with an id and a slug, and deleting that trail twice gets 204 and then 404.

Hint
Refer to Backend Basics and Express for the status code conventions and res.status().json(), and to Backend Express Advanced for the middleware signature and next().

Bonus
The bonus tasks are independent of each other. Pick the one that interests you most.

Challenge
0/4
Search and filter

GET /api/trails accepts ?region=<slug>, ?difficulty=easy|moderate|hard, and ?q= for a part of the title, in any combination

The home page has a search field that uses the same ?q=

The search uses LIKE with a ? parameter. The % signs go into the value, not into the SQL string.

An unknown difficulty gets 400
Done when
?region=scottish-highlands&difficulty=hard returns only “Ben Nevis Mountain Track”, and ?q=loop returns “Tre Cime di Lavaredo Loop” and “Partnach Gorge Loop”.

Hint
Challenge
0/2
Partial updates with PATCH

PATCH /api/trails/:id changes only the fields in the body and keeps all others

Each field in the body is checked like in POST, and a new title gets a new slug
Done when
PATCH /api/trails/3 with { "distance_km": 4 } answers with 200, and the trail keeps its title and slug.

Challenge
0/3
Pagination

The home page shows four trails per page, with links to the previous and the next page

GET /api/trails accepts ?page= and ?pageSize= and returns { items, total, page, pageSize }

The queries use LIMIT and OFFSET, and total comes from a COUNT(*) query
Done when
The home page has two pages, and GET /api/trails?page=2&pageSize=4 returns two items and "total": 6.

Challenge
0/3
Tags

A tags table and a trail_tags junction table in a second seed file, data/tags.sql, with a few tags for the sample trails. db:seed runs both files.

The admin form shows all tags as checkboxes, and saving a trail stores its selection

The trail detail page and GET /api/trails/:slug show the trail’s tags
Done when
A tag you tick in the admin form shows up on the detail page and as a tags array in the API response, and unticking it removes it again.

Hint
Challenge
0/2
Rate limiting

A middleware counts the write requests per API key in memory and answers with 429 once a key goes over a limit you choose, for example five requests per minute

It runs on the write routes, after the API key check
Done when
With a limit of five per minute, the sixth write request within one minute gets 429, and a minute later writes work again.