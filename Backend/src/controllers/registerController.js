const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uploadFile = require("../services/storage.services.js");
const config = require("../config/config");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const file = req.file;

    let profilePic =
      "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png";
    if (file) {
      const result = await uploadFile(file.buffer.toString("base64"));
      profilePic = result.url;
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      await userModel.findOne({
        $or: [{ username: username }, { email: email }],
      })
    ) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      profilePic: profilePic,
    });
    // Generate Access & Refresh tokens
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
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: {
        username,
        email,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { registerController };
