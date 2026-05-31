const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  userAgent: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Automatically delete session from DB when 7-day refresh token expires
  },
});

module.exports = mongoose.model("Session", sessionSchema);
