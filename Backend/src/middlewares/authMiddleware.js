const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const config = require("../config/config");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET )
    const user = await userModel.findOne({_id: decoded.id});
    if(!user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
    
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


module.exports = authMiddleware;
