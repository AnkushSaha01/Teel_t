import React from "react";
import useFollow from "../hooks/useFollow";
import useUnfollow from "../hooks/useUnfollow";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/Context";
import { useProfile } from "../../profile/hooks/useProfile";

const userTile = ({ users }) => {
  const navigate = useNavigate();
  const { backURI } = useContext(GlobalContext);
  const { mutate: followUser, isPending } = useFollow({ backURI });
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollow({ backURI });
  const { data: currentUser } = useProfile({ backURI });

  const handleFollow = (e, userId) => {
    e.stopPropagation();
    if (isPending) return;
    followUser(userId);
  };

  const handleUnfollow = (e, userId) => {
    e.stopPropagation();
    if (isUnfollowPending) return;
    unfollowUser(userId);
  };
  console.log(users);
  return (
    <div>
      {users &&
        users.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/app/profile/${user._id}`)}
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
                <span className="text-black/50 text-sm max-w-[130px] lg:max-w-full truncate">{user.email}</span>
              </div>
            </div>
            {currentUser?._id !== user._id && (
              user.followStatus === "requested" ? (
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-200 text-black text-sm w-24 h-10 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  Requested
                </button>
              ) : user.followStatus === "following" ? (
                <button 
                  onClick={(e) => handleUnfollow(e, user._id)}
                  disabled={isUnfollowPending}
                  className="bg-black/80 text-white text-sm w-20 h-10 rounded-xl hover:bg-black/85 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  following
                </button>
              ) : (
                <button 
                  onClick={(e) => handleFollow(e, user._id)} 
                  disabled={isPending}
                  className="bg-black text-white w-20 h-10 text-sm rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  Follow
                </button>
              )
            )}
          </div>
        ))}
    </div>
  );
};

export default userTile;
