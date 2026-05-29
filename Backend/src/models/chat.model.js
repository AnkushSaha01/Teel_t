const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps:true,
});

chatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel
