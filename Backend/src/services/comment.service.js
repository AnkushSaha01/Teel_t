const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");


const commentService = async (postId, userId, content) => {
    if (!postId || !content) {
        throw new Error("Post ID and content are required");
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const comment = new Comment({
            postId,
            userId,
            content
        });
        await comment.save();
        post.commentCount++;
        await post.save();
        return comment;
    } catch (error) {
        throw error;
    }
}

const getCommentService = async (postId) => {
    if (!postId) {
        throw new Error("Post ID is required");
    }
    try {
        const comments = await Comment.find({ postId }).populate("userId", "username profilePic");
        return comments;
    } catch (error) {
        throw error;
    }
}

module.exports = {commentService,getCommentService};