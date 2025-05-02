const express = require("express");
const routes = express.Router();

const TaskController = require("../controller/TaskController");
const User = require("../models/user");

// Middleware de proteção
function authMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

// Página de login
routes.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// Processa login
routes.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
        return res.render("login", { error: "Usuário ou senha incorretos" });
    }

    req.session.user = user;
    res.redirect("/");
});

// Logout
routes.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// Rotas protegidas — só acessa se estiver logado
routes.get("/", authMiddleware, TaskController.getAllTasks);
routes.post("/create", authMiddleware, TaskController.createTask);
routes.get("/getById/:id", authMiddleware, TaskController.getById);
routes.post("/update/:id", authMiddleware, TaskController.updateTask);
routes.delete("/delete/:id", authMiddleware, TaskController.deleteTask);

module.exports = routes;


