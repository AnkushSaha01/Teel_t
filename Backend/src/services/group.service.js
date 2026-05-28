const mongoose = require("mongoose");
const groupModel = require("../models/group.model");

const createGroup = async ({ name, members, admin }) => {
  try {
    // 1. Basic validation
    if (!name || !admin) {
      throw new Error("Group name and admin are required.");
    }

    // 2. Validate that 'admin' is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(admin)) {
      throw new Error("Invalid Admin ID format.");
    }

    // 3. Initialize and clean the members array
    let memberIds = [];
    if (Array.isArray(members)) {
      // Filter out any invalid ObjectIds sent by the frontend
      memberIds = members.filter((id) => mongoose.Types.ObjectId.isValid(id));
    }

    // 4. Safety Check: Ensure the admin is always part of the members array (using string comparison to avoid ObjectId reference inequality)
    const adminStr = admin.toString();
    if (!memberIds.some((id) => id.toString() === adminStr)) {
      memberIds.push(admin);
    }
    
    const group = await groupModel.create({
      name,
      members: memberIds,
      admin,
      messages: [],
    });
    return group;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createGroup,
};
