const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");

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




const getMe = async(req,res) => {
    
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).json({ user });
    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: "Error getting me" });
    }
}

module.exports = {
  searchUsers,
  getMe
};