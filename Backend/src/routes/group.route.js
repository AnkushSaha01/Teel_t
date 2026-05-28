const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createGroup } = require("../controllers/group.controller");

const groupRouter = express.Router();

groupRouter.post("/create-group", authMiddleware, createGroup);

module.exports = groupRouter;