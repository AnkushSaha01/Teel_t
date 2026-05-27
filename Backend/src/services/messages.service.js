const mongoose = require("mongoose");
const followModel = require("../models/follow.model");
const chatModel = require("../models/chat.model");



const getMessagesService = async (userId) => {
    try {
        const follows = await followModel.find({ 
            $or: [
                { follower: userId, status: "accepted" },
                { followee: userId, status: "accepted" },
            ]
        }).populate("follower", "username email profilePic fullname").populate("followee", "username email profilePic fullname");
        return follows;
    } catch (error) {
        throw new Error(error.message)
    }
}   


const getChatsService = async (userId, receiverId) => {
    try {
        const chats = await chatModel.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId },
            ]
        })


        
        return chats;
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { getMessagesService, getChatsService }