const express = require("express");
const routes = express.Router();

const TaskController = require("../controller/TaskController");

routes.get("/", TaskController.getAllTasks);
routes.post("/create", TaskController.createTask);
routes.get ("/getById/:id", TaskController.getById); // Adicionando o parâmetro ID
routes.delete("/delete/:id", TaskController.deleteTask);
routes.post("/update/:id", TaskController.updateTask); // Adicionando a rota para atualizar

module.exports = routes;