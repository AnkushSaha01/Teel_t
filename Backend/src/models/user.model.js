const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  fullname:{
    type:String,
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
  },
  bannerPic:{
    type:String,
    default:"https://ik.imagekit.io/bvd7qjtev/qingbao-meng-01_igFr7hd4-unsplash.jpg"
  },
  bio:{
    type:String,
    default:"Welcome to my profile! This is a demo bio."
  }
})

const userModel = new mongoose.model("user", userSchema)

module.exports = userModel