const {likePost} = require("../services/like.service");


const likePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user?._id;
        
        const result = await likePost(userId, postId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error liking post", error: error.message });
    }
}



module.exports = {
    likePostController
};