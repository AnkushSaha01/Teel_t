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
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction, // false in development to allow HTTP mobile/PWA testing, true in production
    sameSite: isProduction ? "none" : "lax", // lax in development to allow local cross-port cookie sharing, none in production
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Grab the explicit message set by Passport
  const authMsg = req.user.authMessage || "loggedIn";

  // Redirect to frontend with token parameter
  res.redirect(`${config.CLIENT_URL}/app/feed?token=${accessToken}`);
};

module.exports = { googleAuthCallback };
