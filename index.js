require('dotenv').config(); // Carrega as variáveis do arquivo .env para process.env
const express = require("express");
const path = require("path");
const session = require("express-session"); 
const routes = require("./routes/routes");
const conectToDb = require("./database/db");

conectToDb();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({                       
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);                

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);



