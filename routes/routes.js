const express = require("express");
const routes = express.Router(); 

const TaskController = require("../controller/TaskController")

routes.get("/home", TaskController.getAll)

module.exports = routes;