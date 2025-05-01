const express = require("express");
const routes = express.Router();

const TaskController = require("../controller/TaskController");

routes.get("/", TaskController.getAllTasks);
routes.post("/create", TaskController.createTask);

module.exports = routes;
