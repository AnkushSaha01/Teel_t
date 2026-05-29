const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");
const uploadFile = require("../services/storage.services");

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // search query
    if (!q) {
      return res.status(200).json({ users: [] });
    }

    // Search for users where username or email matches the query using regex (case-insensitive)
    const users = await userModel.aggregate(
      [
        {
          $search: {
            index: "user_search_index",
            autocomplete: {
              query: q,
              path: "username",
            },
          },
        },
        {
          $lookup: {
            from: "follows",
            as: "requestStatus",
            let: { searchUser: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$followee", "$$searchUser"],
                      },
                      {
                        $eq: [
                          "$follower",
                          new mongoose.Types.ObjectId(req.user._id),
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            followStatus: {
              $cond: {
                if: {
                  $lt: [{ $size: "$requestStatus" }, 1],
                },
                then: null,
                else: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $arrayElemAt: ["$requestStatus.status", 0],
                        },
                        "pending",
                      ],
                    },
                    then: "requested",
                    else: "following",
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            username: 1,
            profilePic: 1,
            email: 1,
            followStatus: 1,
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    ); // Exclude passwords from the results

    res.status(200).json({ users });
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersCount = await followModel.countDocuments({
      followee: userId,
      status: "accepted",
    });

    const followingCount = await followModel.countDocuments({
      follower: userId,
      status: "accepted",
    });

    res.status(200).json({
      user: {
        ...user,
        followersCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ message: "Error getting me" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, username, bio } = req.body;
    let profilePicUrl;
    let bannerPicUrl;

    if (req.files) {
      if (req.files.profilePic && req.files.profilePic[0]) {
        const file = req.files.profilePic[0];
        const uploadResult = await uploadFile(file.buffer, "profile-pic", "/users");
        if (uploadResult) {
          profilePicUrl = uploadResult.url;
        }
      }
      if (req.files.bannerPic && req.files.bannerPic[0]) {
        const file = req.files.bannerPic[0];
        const uploadResult = await uploadFile(file.buffer, "banner-pic", "/users");
        if (uploadResult) {
          bannerPicUrl = uploadResult.url;
        }
      }
    }

    // Check if new username is already taken by another user
    if (username) {
      const existingUser = await userModel.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(fullname !== undefined && { fullname }),
          ...(username !== undefined && { username }),
          ...(profilePicUrl !== undefined && { profilePic: profilePicUrl }),
          ...(bannerPicUrl !== undefined && { bannerPic: bannerPicUrl }),
          ...(bio !== undefined && { bio }),
        },
      },
      { new: true, runValidators: true }
    ).lean();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await userModel.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersCount = await followModel.countDocuments({
      followee: id,
      status: "accepted",
    });

    const followingCount = await followModel.countDocuments({
      follower: id,
      status: "accepted",
    });

    // Check relationship from current logged in user to this target user
    const followRelation = await followModel.findOne({
      follower: currentUserId,
      followee: id,
    });

    let followStatus = null; // not following
    if (followRelation) {
      followStatus = followRelation.status === "accepted" ? "following" : "requested";
    }

    res.status(200).json({
      user: {
        ...user,
        followersCount,
        followingCount,
        followStatus,
      },
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Error getting user profile" });
  }
};

module.exports = {
  searchUsers,
  getMe,
  updateProfile,
  getUserById,
};
