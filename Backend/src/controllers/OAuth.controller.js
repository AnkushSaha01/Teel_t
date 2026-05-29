const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../models/user.model");

const googleAuthCallback = async (req, res) => {
  // Generate JWT token
  const token = jwt.sign(
    {
      id: req.user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Set token in an HTTP-only cookie (adjust domain/secure settings as needed for production)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // MUST be true in production to allow HTTPS transmission
    sameSite: "none", // MUST be "none" to allow cross-domain cookie transmission
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Grab the explicit message set by Passport
  const authMsg = req.user.authMessage || "loggedIn";

  // Redirect to frontend
  res.redirect(`http://localhost:3000/app/feed`);
};

module.exports = { googleAuthCallback };
