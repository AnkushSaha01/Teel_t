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
  res.cookie("token", token);

  // Grab the explicit message set by Passport
  const authMsg = req.user.authMessage || "loggedIn";


  // Redirect to frontend
  res.redirect(`http://localhost:3000/app/feed`);
};

module.exports = { googleAuthCallback };
