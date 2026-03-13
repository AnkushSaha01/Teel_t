const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author:String,
    profilePic:String,
    
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;