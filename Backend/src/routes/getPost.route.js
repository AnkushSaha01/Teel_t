const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/get-post",authMiddleware, postController.getPost);

module.exports = router;