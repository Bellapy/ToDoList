const express = require("express");
const path = require("path");
const session = require("express-session"); // ✅ IMPORTADO AQUI
const routes = require("./routes/routes");
const conectToDb = require("./database/db");

conectToDb();
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({                       // ✅ ADICIONADO AQUI
  secret: 'chave-simples',
  resave: false,
  saveUninitialized: true
}));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);                        // ✅ As rotas vêm depois da sessão

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);

const User = require("./models/user");

async function criarUsuarioSimples() {
  const existe = await User.findOne({ username: "admin" });
  if (!existe) {
    await User.create({ username: "admin", password: "1234" });
    console.log("Usuário criado: admin / 1234");
  }
}
criarUsuarioSimples();
