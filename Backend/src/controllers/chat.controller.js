const { getChatsService } = require("../services/messages.service");


const getChats = async(req,res)=>{
try {
    const userId = req.user._id;
    const receiverId = req.params.receiverId;
    const chats = await getChatsService(userId, receiverId);
    res.status(200).json(chats);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

module.exports = { getChats }