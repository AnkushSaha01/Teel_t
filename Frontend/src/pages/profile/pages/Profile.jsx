import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile, useUpdateProfile, useUserProfile, useUserPosts } from "../hooks/useProfile";
import { logoutUser } from "../services/profile.services";
import { GlobalContext } from "../../../context/Context";
import Search from "../../search/Search";
import EditProfileModal from "../components/EditProfileModal";
import  PickLists  from "../components/PickLists";
import useFollow from "../../search/hooks/useFollow";
import useUnfollow from "../../search/hooks/useUnfollow";
import PostTile from "../../search/components/postTile";

const Profile = () => {
  const { backURI, updateAccessToken } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const queryClient = useQueryClient();

  // Query own logged-in profile
  const ownProfileResult = useProfile({ backURI });
  const ownUserId = ownProfileResult.data?._id;
  const isOwnProfile = !userId || userId === ownUserId;

  // Query targeted profile - disabled if it's the own profile
  const userProfileResult = useUserProfile({ backURI, userId: isOwnProfile ? undefined : userId });

  const profileResult = isOwnProfile ? ownProfileResult : userProfileResult;
  const data = profileResult.data;
  const isLoading = profileResult.isLoading;
  const isError = profileResult.isError;

  // Query posts created by target user
  const targetAuthorId = isOwnProfile ? ownUserId : userId;
  const { data: posts, isLoading: isPostsLoading } = useUserPosts({ backURI, authorId: targetAuthorId });

  const updateProfileMutation = useUpdateProfile();
  const followUserMutation = useFollow({ backURI });
  const unfollowUserMutation = useUnfollow({ backURI });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  const handleProfileFollow = () => {
    if (followUserMutation.isPending) return;
    followUserMutation.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    });
  };

  const handleProfileUnfollow = () => {
    if (unfollowUserMutation.isPending) return;
    unfollowUserMutation.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    });
  };

  const handleSaveProfile = (profileData) => {
    setErrorMsg("");
    
    const formData = new FormData();
    formData.append("fullname", profileData.fullname);
    formData.append("username", profileData.username);
    formData.append("bio", profileData.bio);
    
    if (profileData.profilePic) {
      formData.append("profilePic", profileData.profilePic);
    }
    if (profileData.bannerPic) {
      formData.append("bannerPic", profileData.bannerPic);
    }

    updateProfileMutation.mutate(
      { backURI, profileData: formData },
      {
        onSuccess: () => {
          setIsEditProfileOpen(false);
        },
        onError: (err) => {
          setErrorMsg(err?.response?.data?.message || "Failed to update profile");
        },
      }
    );
  };

  const handleLogout = async () => {
    try {
      await logoutUser({ backURI });
      updateAccessToken(null);
      // Clear React Query cache so the next user doesn't see stale profile/feed data
      queryClient.clear();
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-['ClashGrotesk-Variable']">
        Loading profile...
      </div>
    );
  if (isError)
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-['ClashGrotesk-Variable'] text-red-500">
        Error loading profile.
      </div>
    );

  return (
    <div className="w-full  bg-[#f0efeb] flex flex-col items-center py-10 px-4 font-['ClashGrotesk-Variable']">
      {/* Profile Section */}
      <div className="w-full relative max-w-3xl bg-black/85 shadow-lg rounded-2xl overflow-hidden md:p-12 mb-4 flex flex-col items-start  transition-all hover:shadow-xl">
        <img
          src={data?.bannerPic || "https://ik.imagekit.io/bvd7qjtev/qingbao-meng-01_igFr7hd4-unsplash.jpg"}
          alt=""
          className="-mb-24 w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="p-8 w-full">
          <div className="flex justify-between mb-6 items-end  ">
            <div className="relative  w-fit">
              <img
                src={
                  data?.profilePic ||
                  "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"
                }
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="text-gray-100 text-sm flex flex-col items-center">
              <span>{data?.followersCount ?? 0}</span>
              followers
            </div>
            <div className="text-gray-100 text-sm flex flex-col items-center">
              <span>{data?.followingCount ?? 0}</span>
              following
            </div>
          </div>

          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col ">
              <h1 className="text-2xl md:text-4xl font-medium text-white  ">
                {data?.fullname || "user"}
              </h1>

              <h1 className="text-md md:text-lg text-white/80 tracking-tight ">
                @{data?.username || "user"}
              </h1>
            </div>

            {isOwnProfile ? (
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-white/40 text-black p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer border border-transparent font-sans"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            ) : (
              data?.followStatus === "requested" ? (
                <button 
                  className="bg-gray-200/20 text-gray-400 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-gray-500/20 cursor-not-allowed"
                  disabled
                >
                  Requested
                </button>
              ) : data?.followStatus === "following" ? (
                <button 
                  onClick={handleProfileUnfollow}
                  disabled={unfollowUserMutation.isPending}
                  className="bg-white/10 text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer border border-white/20"
                >
                  following
                </button>
              ) : (
                <button 
                  onClick={handleProfileFollow}
                  disabled={followUserMutation.isPending}
                  className="bg-white text-black px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  Follow
                </button>
              )
            )}
          </div>

          <div className="w-16 h-1 bg-white/10 rounded-full my-4"></div>

          <p className="text-gray-300 text-sm leading-5 max-w-lg ">
            {data?.bio || "Welcome to my profile! This is a demo bio. I am a passionate creator who loves building beautiful and scalable web applications. Always eager to learn new technologies and craft amazing user experiences. ✨"}
          </p>

          {/* Logout Button */}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-black/70 text-[#F0EFEB] text-xs font-semibold tracking-wider uppercase p-4 rounded-full hover:bg-black/85 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer border border-transparent font-sans"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex w-full justify-between text-md uppercase font-medium border-b border-black/30 mb-6">
        <span
          onClick={() => setActiveTab("posts")}
          className={`w-full text-center py-2.5 cursor-pointer transition-all duration-300 border-b-2 -mb-[1px] ${
            activeTab === "posts"
              ? "text-black border-black font-medium"
              : "text-black/40 border-transparent hover:text-black/60 font-medium"
          }`}
        >
          posts
        </span>
        <span
          onClick={() => setActiveTab("picklist")}
          className={`w-full text-center py-2.5 cursor-pointer transition-all duration-300 border-b-2 -mb-[1px] ${
            activeTab === "picklist"
              ? "text-black border-black font-medium"
              : "text-black/40 border-transparent hover:text-black/60 font-medium"
          }`}
        >
          picklist
        </span>
      </div>

      {/* Conditionally Render Posts or Sleeves Section */}
      {activeTab === "posts" ? (
        <div className="w-full max-w-3xl flex flex-col mb-20 animate-[fadeIn_0.25s_ease-out]">
          {isPostsLoading ? (
            <div className="w-full text-center text-black/50 py-10 uppercase tracking-widest text-xs">
              Loading posts...
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostTile key={post._id} post={post} fallbackUser={data} isOwnProfile={isOwnProfile} />
            ))
          ) : (
            <div className="w-full text-center text-black/40 py-16 uppercase tracking-widest text-xs font-medium">
              No posts created yet.
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-3xl mb-20 animate-[fadeIn_0.25s_ease-out]">
          <PickLists userId={targetAuthorId} isOwnProfile={isOwnProfile} />
        </div>
      )}
      

      

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => {
          setIsEditProfileOpen(false);
          setErrorMsg("");
        }}
        user={data}
        onSave={handleSaveProfile}
        isSaving={updateProfileMutation.isPending}
        error={errorMsg}
      />
    </div>
  );
};

export default Profile;
