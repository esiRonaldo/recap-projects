import express from "express";

const app = express();
const port = Number(process.env.PORT);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
