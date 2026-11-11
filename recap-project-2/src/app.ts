import express from "express";
import nunjucks from "nunjucks"
import { connectDB, closeDB } from "./models/db";
import websiteRouter from "./routes/websiteRoutes"
import adminRouter from "./routes/adminRoutes"
import { logger } from "./middleware/logger";


const app = express();
const port = Number(process.env.PORT);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
})
app.set("view engine", "html")

app.use(express.static("public"))
app.use(logger)
app.use(express.urlencoded({ extended: true }))

app.use('/', websiteRouter)
app.use('/admin', adminRouter)

await connectDB()
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

async function shutdown(signal: string) {
  console.log(`\n${signal} received, closing database...`);
  await closeDB();
  console.log("Database closed. Bye!");
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));