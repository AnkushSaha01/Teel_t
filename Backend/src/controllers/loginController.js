const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const loginController = async (req, res)=>{
  try {
    const {identifier, password} = req.body;
    const user = await userModel.findOne({
      $or: [{username: identifier}, {email: identifier}]
    })
    if(!user){
      return res.status(400).json({message: "User doesn't exist"})
    }

    const isPassValid = await bcrypt.compare(password, user.password)
    if(!isPassValid){
      return res.status(400).json({message: "Invalid password"})
    }

    const newToken = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    res.status(200).json({message: "Login successful", user:{
      username: user.username,
      email: user.email,
      _id:user._id
    }}) 

  } catch (error) {
    res.status(500).json({message: "Internal server error", error})
  }
}

module.exports = {loginController}
