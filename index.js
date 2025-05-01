const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
//ROTA
app.get("/home", (req, res) => {
  res.render("index");
});
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
