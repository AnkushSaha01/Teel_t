const groupService = require("../services/group.service")

const createGroup = async (req, res) => {

    const {name, members} = req.body
    const admin = req.user._id
    try {
        const group = await groupService.createGroup({name, members, admin});
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createGroup
}