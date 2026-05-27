const { getMessagesService } = require("../services/messages.service");

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const follows = await getMessagesService(userId);
    res.status(200).json({ follows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages };
