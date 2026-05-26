const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    

}, {timestamps: true});

const CommentModel = mongoose.model("comment", commentSchema);

module.exports = CommentModel;