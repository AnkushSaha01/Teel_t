const express = require("express");
const interactionRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { likePostController } = require("../controllers/likePostController");
const { commentPostController,getCommentPostController } = require("../controllers/commentPostController");

interactionRouter.post("/like", authMiddleware, likePostController);
interactionRouter.post("/comment/create-comment/:postId", authMiddleware, commentPostController);
interactionRouter.get("/comment/get-comments/:postId", getCommentPostController);

module.exports = interactionRouter;