const mongoose = require("mongoose");
const postModel = require("../models/post.model");

const createPost = async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    
    // const author = req.body.author;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await postModel.create({
        title: title,
        content: content,
        // author: author
    });

    res.status(201).json({ message: "Post created successfully", post });
}

const getPost = async (req, res) => {
    const posts = await postModel.find();
    res.status(200).json({ message: "Posts fetched successfully", posts });
}

module.exports = { createPost, getPost };