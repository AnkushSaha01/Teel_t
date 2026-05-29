const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createGroup, getUserGroups, getGroupMessages } = require("../controllers/group.controller");

const groupRouter = express.Router();

groupRouter.post("/create-group", authMiddleware, createGroup);
groupRouter.get("/user-groups", authMiddleware, getUserGroups);
groupRouter.get("/get-messages/:groupId", authMiddleware, getGroupMessages);

module.exports = groupRouter;