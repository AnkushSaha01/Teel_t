const userModel = require("../models/user.model");
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

    const newToken = jwt.sign({ id: user._id }, config.JWT_SECRET);
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true, // MUST be true in production to allow HTTPS transmission
      sameSite: "none", // MUST be "none" to allow cross-domain cookie transmission
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
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
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { loginController, logoutController };
