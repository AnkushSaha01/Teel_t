const {commentService, getCommentService} = require("../services/comment.service");

const commentPostController = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user?._id;
        const postId = req.params.postId;

        if(!content || !userId || !postId){
            return res.status(400).json({ message: "Comment is required" });
        }

        const comment = await commentService(postId, userId, content);
        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message || "Error adding comment",
            error: error.message 
        });
    }
};

const getCommentPostController = async (req, res) => {
    try {
        const postId = req.params.postId;

        if(!postId){
            return res.status(400).json({ message: "Post ID is required" });
        }

        const comments = await getCommentService(postId);
        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message || "Error fetching comments",
            error: error.message 
        });
    }
};

module.exports = {
    commentPostController,
    getCommentPostController
};
