const express = require("express");
const { 
  followUser, 
  unFollowUser, 
  getPendingRequests, 
  acceptFollowRequest, 
  rejectFollowRequest 
} = require("../controllers/followController");
const authMiddleware  = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/requests", authMiddleware, getPendingRequests);
router.post("/accept/:id", authMiddleware, acceptFollowRequest);
router.post("/reject/:id", authMiddleware, rejectFollowRequest);
router.post("/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unFollowUser);

module.exports = router;