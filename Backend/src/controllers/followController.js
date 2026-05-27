const mongoose = require("mongoose");
const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

const followUser = async (req, res) => {
    try {
        const { id } = req.params;
        const follower = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (follower.toString() === id.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const existingFollow = await followModel.findOne({ follower, followee: id });
        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        const follow = await followModel.create({ follower, followee: id });

        res.status(201).json({ message: "User followed successfully", follow });
    } catch (error) {
        console.error("Follow User Error:", error);
        res.status(500).json({ message: "Error following user" });
    }
};

const unFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const follower = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const follow = await followModel.findOneAndDelete({ follower, followee: id });
        if (!follow) {
            return res.status(404).json({ message: "Follow relationship not found" });
        }

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        console.error("Unfollow User Error:", error);
        res.status(500).json({ message: "Error unfollowing user" });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const followee = req.user._id;
        const requests = await followModel.find({ followee, status: "pending" })
            .populate("follower", "username email profilePic fullname")
            .sort({ createdAt: -1 });

        res.status(200).json({ requests });
    } catch (error) {
        console.error("Get Pending Requests Error:", error);
        res.status(500).json({ message: "Error fetching follow requests" });
    }
};

const acceptFollowRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const followee = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const follow = await followModel.findOne({ follower: id, followee });
        if (!follow) {
            return res.status(404).json({ message: "Follow request not found" });
        }

        follow.status = "accepted";
        await follow.save();

        res.status(200).json({ message: "Follow request accepted", follow });
    } catch (error) {
        console.error("Accept Follow Request Error:", error);
        res.status(500).json({ message: "Error accepting follow request" });
    }
};

const rejectFollowRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const followee = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const follow = await followModel.findOneAndDelete({ follower: id, followee });
        if (!follow) {
            return res.status(404).json({ message: "Follow request not found" });
        }

        res.status(200).json({ message: "Follow request rejected" });
    } catch (error) {
        console.error("Reject Follow Request Error:", error);
        res.status(500).json({ message: "Error rejecting follow request" });
    }
};

module.exports = { followUser, unFollowUser, getPendingRequests, acceptFollowRequest, rejectFollowRequest };