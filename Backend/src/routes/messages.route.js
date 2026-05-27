const express = require("express");
const messageRouter = express.Router();
const {
  sendMessage,
  getMessages,

} = require("../controllers/messages.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const { getChats } = require("../controllers/chat.controller");

// messageRouter.post("/send", authMiddleware, sendMessage);
messageRouter.get("/get-messages", authMiddleware, getMessages);
messageRouter.get("/get-chats/:receiverId", authMiddleware, getChats);

module.exports = messageRouter;
