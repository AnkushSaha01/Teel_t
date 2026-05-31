const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

const loginController = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate short-lived Access Token (15 minutes) and long-lived Refresh Token (7 days)
    const accessToken = jwt.sign({ id: user._id }, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Store Session in separate DB collection
    await sessionModel.create({
      userId: user._id,
      refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    // Clear legacy single JWT cookie if present
    res.clearCookie("token");

    // Set Refresh Token in secure httpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // false in development to allow HTTP mobile/PWA testing, true in production
      sameSite: isProduction ? "none" : "lax", // lax in development to allow local cross-port cookie sharing, none in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (refreshToken) {
      // Invalidate the session on the database
      await sessionModel.deleteOne({ refreshToken });
    }

    // Clear cookies
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token");
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized: Missing refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired refresh token" });
    }

    // Check if session exists in DB
    const session = await sessionModel.findOne({ refreshToken });
    if (!session) {
      // Replay Attack Detection: If a valid refresh token is used but no active session matches it,
      // it might have already been used/rotated (e.g. stolen). Invalidate ALL sessions for this user!
      await sessionModel.deleteMany({ userId: decoded.id });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(401).json({ message: "Security Alert: Session hijacked. Please log in again." });
    }

    // Generate new Access and Refresh tokens (Refresh Token Rotation)
    const newAccessToken = jwt.sign({ id: decoded.id }, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: decoded.id }, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Rotate/Replace the refresh token in the database
    session.refreshToken = newRefreshToken;
    session.createdAt = new Date(); // Reset TTL expiration timer
    await session.save();

    // Set the new rotated Refresh Token cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ 
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { loginController, logoutController, refreshController };
