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
        const limit = parseInt(req.query.limit) || 3;
        const cursor = req.query.cursor;
        const authorId = req.query.authorId;
        const userId = req.user?._id;

        const pipeline = [];

        if (authorId) {
            const mongoose = require("mongoose");
            if (mongoose.Types.ObjectId.isValid(authorId)) {
                pipeline.push({
                    $match: {
                        author: new mongoose.Types.ObjectId(authorId)
                    }
                });
            }
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: { path: '$author' } }
        );

        // If user is logged in, check if they liked each post
        if (userId) {
            const mongoose = require("mongoose");
            const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
            
            pipeline.push({
                $lookup: {
                    from: 'likes',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$post', '$$postId'] },
                                        { $eq: ['$user', userObjectId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userLikes'
                }
            });
        }

        // Apply cursor filter if it exists
        if (cursor) {
            pipeline.push({
                $match: {
                    createdAt: { $lt: new Date(cursor) }
                }
            });
        }

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            {
                $project: {
                    title: 1,
                    content: 1,
                    media: 1,
                    author: '$author.username',
                    profilePic: '$author.profilePic',
                    createdAt: 1,
                    likeCount: { $ifNull: ['$likeCount', 0] },
                    commentCount : {$ifNull:['$commentCount',0]},
                    isLiked: userId ? { $gt: [{ $size: { $ifNull: ['$userLikes', []] } }, 0] } : { $literal: false }
                }
            }
        );

        const posts = await postModel.aggregate(pipeline);
        
        const nextCursor = posts.length === limit ? posts[posts.length - 1].createdAt : null;

        res.status(200).json({ 
            message: "Posts fetched successfully", 
            posts,
            nextCursor 
        });
    } catch (error) {
        console.error("Fetch Posts Error:", error);
        res.status(500).json({ message: "Error fetching posts" });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id;

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Verify if logged-in user is the author
        if (post.author.toString() !== currentUserId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await postModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete Post Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const currentUserId = req.user._id;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Verify if logged-in user is the author
        if (post.author.toString() !== currentUserId.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            id,
            { $set: { title, content } },
            { new: true }
        );

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error("Update Post Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createPost, getPost, deletePost, updatePost };