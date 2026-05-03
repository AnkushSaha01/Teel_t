const postModel = require("../models/post.model");
const uploadFile = require("../services/storage.services");

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author = req.user._id;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const media = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (!file.buffer) {
                    console.error("File buffer missing for file:", file.originalname);
                    continue;
                }
                const result = await uploadFile(file.buffer, "post-media", "/posts");
                if (result) {
                    media.push({
                        url: result.url,
                        type: file.mimetype.startsWith("video") ? "video" : "image"
                    });
                }
            }
        }

        const post = await postModel.create({
            title,
            content,
            author,
            media
        });

        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getPost = async (req, res) => {
    try {
        const posts = await postModel.aggregate(
  [
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: { path: '$author' } },
    {
      $project: {
        title: 1,
        content: 1,
        media: 1,
        author: '$author.username',
        profilePic: '$author.profilePic',
        createdAt: 1
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true })
        res.status(200).json({ message: "Posts fetched successfully", posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
}

module.exports = { createPost, getPost };