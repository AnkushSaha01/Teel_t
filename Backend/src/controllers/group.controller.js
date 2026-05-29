const groupService = require("../services/group.service")

const createGroup = async (req, res) => {

    const {name, members, duration} = req.body
    const admin = req.user._id
    try {
        const group = await groupService.createGroup({name, members, admin, duration});
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserGroups = async (req, res) => {
    const userId = req.user._id;
    try {
        const groups = await groupService.getUserGroups(userId);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGroupMessages = async (req, res) => {
    const { groupId } = req.params;
    try {
        const messages = await groupService.getGroupMessages(groupId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createGroup,
    getUserGroups,
    getGroupMessages,
}