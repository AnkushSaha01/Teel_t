import React from "react";
import useFollow from "../hooks/useFollow";
import { useContext } from "react";
import { GlobalContext } from "../../../context/Context";

const userTile = ({ users }) => {
  const { backURI } = useContext(GlobalContext);
  const { mutate: followUser, isPending } = useFollow({ backURI });
  const handleFollow = (userId) => {
    if (isPending) return;
    followUser(userId);
  };
  console.log(users);
  return (
    <div>
      {users &&
        users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between gap-4 p-4 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-black/10"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border border-black/10"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-medium text-lg">{user.username}</span>
                <span className="text-black/50 text-sm max-w-[150px] lg:max-w-full truncate">{user.email}</span>
              </div>
            </div>
            {user.followStatus === "requested" ? (
              <button 
                className="bg-gray-200 text-black w-24 h-10 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                Requested
              </button>
            ) : user.requestStatus === "accepted" ? (
              <button 
                className="bg-black text-white w-24 h-10 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                following
              </button>
            ) : (
              <button 
                onClick={() => handleFollow(user._id)} 
                disabled={isPending}
                className="bg-black text-white w-24 h-10 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                Follow
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default userTile;
