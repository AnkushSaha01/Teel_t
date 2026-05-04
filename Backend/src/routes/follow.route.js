const express = require("express");
const { followUser, unFollowUser } = require("../controllers/followController");
const authMiddleware  = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unFollowUser);

module.exports = router;