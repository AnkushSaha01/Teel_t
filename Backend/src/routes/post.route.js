const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");


const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-post", authMiddleware, upload.array("media", 10), postController.createPost);
router.delete("/delete-post/:id", authMiddleware, postController.deletePost);
router.put("/update-post/:id", authMiddleware, postController.updatePost);

module.exports = router;