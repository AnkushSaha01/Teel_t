const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        name: String,
        admin: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
        expiresAt: { type: Date },
    },
    { timestamps: true }
);

groupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const groupModel = mongoose.model("Group", groupSchema);

module.exports = groupModel