const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");

const googleAuthCallback = async (req, res) => {
  // Generate Access and Refresh tokens
  const accessToken = jwt.sign({ id: req.user._id }, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: req.user._id }, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  // Store Session in separate DB collection
  await sessionModel.create({
    userId: req.user._id,
    refreshToken,
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
  });

  // Clear legacy cookie if present
  res.clearCookie("token");

  // Set Refresh Token in secure httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // MUST be true in production to allow HTTPS transmission
    sameSite: "none", // MUST be "none" to allow cross-domain cookie transmission
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Grab the explicit message set by Passport
  const authMsg = req.user.authMessage || "loggedIn";

  // Redirect to frontend with token parameter
  res.redirect(`${config.CLIENT_URL}/app/feed?token=${accessToken}`);
};

module.exports = { googleAuthCallback };
