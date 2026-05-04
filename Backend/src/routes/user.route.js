const express = require("express");
const { searchUsers, getMe } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/search", authMiddleware, searchUsers);
router.get("/get-me", authMiddleware, getMe);

module.exports = router;
