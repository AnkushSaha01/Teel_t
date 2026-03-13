const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/create-post", authMiddleware, postController.createPost);

module.exports = router;