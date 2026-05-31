const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const config = require("../config/config");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    const user = await userModel.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "TokenExpired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};


module.exports = authMiddleware;
