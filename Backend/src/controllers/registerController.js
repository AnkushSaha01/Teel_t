const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uploadFile = require("../services/storage.services.js");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const file = req.file;

    let profilePic = "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"
    if(file){
      const result = await uploadFile(file.buffer.toString("base64"));
      profilePic = result.url;
    }
    if(!username || !email || !password){
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
      profilePic: profilePic
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.status(201).json({ message: "User created successfully", user:{
      username,
      email,
      _id:user._id
    } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { registerController };
