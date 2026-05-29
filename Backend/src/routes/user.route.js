const express = require("express");
const { searchUsers, getMe, updateProfile, getUserById } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/search", authMiddleware, searchUsers);
router.get("/get-me", authMiddleware, getMe);
router.get("/get-user/:id", authMiddleware, getUserById);
router.put(
  "/update-profile", 
  authMiddleware, 
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "bannerPic", maxCount: 1 }
  ]), 
  updateProfile
);

module.exports = router;
