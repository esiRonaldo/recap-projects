import express from "express";
import nunjucks from "nunjucks"

const app = express();
const port = Number(process.env.PORT);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
})
app.set("view engine", "html")

app.use(express.static("public"))

app.get('/', (req, res) => res.render('index'))
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
