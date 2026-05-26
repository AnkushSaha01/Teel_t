const Post = require("../models/post.model");
const Like = require("../models/likes.model");

const likePost = async (userId, postId) => {
  try {
    const isAlredyLiked = await Like.findOne({
      user: userId,
      post: postId,
    });
    if (isAlredyLiked) {
      await Like.findByIdAndDelete(isAlredyLiked._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
      return { message: "Post unliked successfully" };
    }
    const like = await Like.create({
      user: userId,
      post: postId,
    });
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
    return { message: "Post liked successfully" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  likePost,
};
