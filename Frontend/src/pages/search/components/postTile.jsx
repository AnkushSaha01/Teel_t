import React, { useState, useRef, useEffect, useContext } from "react";
import { GlobalContext } from "../../../context/Context";
import { useDeletePost, useUpdatePost } from "../../profile/hooks/useProfile";
import EditPostModal from "../../profile/components/EditPostModal";
import Media from "../../feed/components/Media";
import Interaction from "../../feed/components/Interaction";

const PostTile = ({ post, fallbackUser, isOwnProfile }) => {
  const { backURI } = useContext(GlobalContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dropdownRef = useRef(null);

  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDelete = () => {
    setShowDropdown(false);
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate({ backURI, postId: post._id });
    }
  };

  const handleSaveEdit = (editedData) => {
    setErrorMsg("");
    updatePostMutation.mutate(
      {
        backURI,
        postId: post._id,
        title: editedData.title,
        content: editedData.content,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
        onError: (err) => {
          setErrorMsg(err?.response?.data?.message || "Failed to update post");
        },
      }
    );
  };

  return (
    <div
      className="w-full bg-white/80 backdrop-blur-md border border-black/10 rounded-3xl p-6 md:p-8 mt-4 shadow-sm hover:shadow-md transition-all duration-300 relative"
    >
      <div className="flex items-center justify-between gap-3 mb-6 relative">
        <div className="flex items-center gap-3">
          <img
            className="w-8 h-8 rounded-full object-cover border border-black/10"
            src={post.profilePic || fallbackUser?.profilePic || "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"}
            referrerPolicy="no-referrer"
            alt={post.author || fallbackUser?.username}
          />
          <span className="text-sm font-medium tracking-tight text-black/60">
            {post.author || fallbackUser?.username}
          </span>
        </div>

        {isOwnProfile && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 hover:bg-black/5 active:scale-95 rounded-full transition-all duration-200 cursor-pointer text-black/60 hover:text-black flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>

            {/* Glassmorphic Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white/95 backdrop-blur-md border border-black/10 rounded-2xl shadow-xl z-20 py-2 animate-[fadeIn_0.15s_ease-out] font-sans">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setIsEditOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black/75 hover:text-black hover:bg-black/5 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h2 className="text-xl md:text-2xl font-medium  uppercase ">
        {post.title}
      </h2>
      <div className="w-12 border-b border-black/10 my-2"></div>

      <p className="text-md leading-5 md:text-base text-black/80 font-normal  mb-4">
        {post.content}
      </p>

      {/* Media carousel */}
      <Media post={post} />

      {/* Like / Comment / Share interaction bar */}
      <div className="border-t border-black/5 pt-2 mt-4">
        <Interaction
          postId={post._id}
          initialLikesCount={post.likeCount || 0}
          initialLikedState={post.isLiked || false}
          initialCommentCount={post.commentCount || 0}
        />
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setErrorMsg("");
        }}
        post={post}
        onSave={handleSaveEdit}
        isSaving={updatePostMutation.isPending}
        error={errorMsg}
      />
    </div>
  );
};

export default PostTile;
