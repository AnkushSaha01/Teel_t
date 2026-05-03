const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  googleId:{
    type:String,
    unique:true,
    sparse:true
  },
  password:{
    type:String,
  },
  profilePic:{
    type:String,
    default:"https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"
  }
})

const userModel = new mongoose.model("user", userSchema)

module.exports = userModel