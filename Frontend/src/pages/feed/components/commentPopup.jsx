import React, { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import useInteraction from "../hooks/useInteraction";
import { GlobalContext } from "../../../context/Context";
import { useProfile } from "../../profile/hooks/useProfile";

const CommentPopup = ({
  isOpen,
  onClose,
  onCommentsCountChange,
  postId,
}) => {
  const { backURI, accessToken } = useContext(GlobalContext);
  const { data: profile } = useProfile({ backURI , accessToken});
  const { comments, createComment, isCommentsLoading } = useInteraction(postId);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Sync the comment count back to the parent component on changes
  useEffect(() => {
    if (onCommentsCountChange) {
      onCommentsCountChange(comments.length);
    }
  }, [comments.length, onCommentsCountChange]);

  const handleAddComment = async () => {
    if (!newComment.trim() || isPosting) return;
    
    setIsPosting(true);
    try {
      await createComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      {/* Dialog Card */}
      <div className="bg-[#F0EFEB] border border-black/10 rounded-3xl p-6 md:p-8 w-[90%] max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative animate-[scaleUp_0.25s_ease-out] flex flex-col max-h-[80vh] font-['ClashGrotesk-Variable']">
        
        {/* Close Button on Top Left Corner */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black/50 hover:text-black transition-all hover:scale-110 p-1.5 rounded-full hover:bg-black/5 flex items-center justify-center"
          aria-label="Close comments"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-medium  uppercase text-center mb-6 mt-1 text-black select-none">
          Comments
        </h2>

        {/* Comments Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar flex flex-col gap-4 mb-6 min-h-[200px]">
          {isCommentsLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-black/40 uppercase tracking-widest text-xs font-semibold select-none">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-black/40 uppercase tracking-widest text-xs font-semibold select-none">
              No replies yet.
            </div>
          ) : (
            comments.map((comment) => {
              const authorName = comment.userId?.username || "user";
              const avatarUrl = comment.userId?.profilePic;
              const formattedTime = comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now";

              return (
                <div
                  key={comment._id}
                  className="flex gap-3 text-sm items-start py-1 animate-[fadeIn_0.2s_ease-out]"
                >
                  {/* Avatar (Image or Letter) */}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={authorName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 select-none border border-black/5"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold uppercase shrink-0 text-black select-none">
                      {authorName[0]}
                    </div>
                  )}

                  <div className="flex flex-col bg-black/5 px-4 py-2.5 rounded-2xl max-w-[85%] border border-black/5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm lowercase text-black">
                        @{authorName}
                      </span>
                      <span className="text-[9px] text-black/35 font-normal tracking-wide">
                        {formattedTime}
                      </span>
                    </div>
                    <p className="text-black/80 text-sm mt-1 leading-normal font-normal">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Box / Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddComment();
          }}
          className="flex gap-3 items-center border-t border-black/10 pt-4 bg-[#F0EFEB]"
        >
          {profile?.profilePic ? (
            <img
              src={profile.profilePic}
              alt={profile?.username || "user"}
              className="w-8 h-8 rounded-full object-cover shrink-0 select-none border border-black/5"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase shrink-0 select-none">
              {(profile?.username || "Y")[0]}
            </div>
          )}
          <input
            type="text"
            placeholder="Add a reply..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-black/5 border border-black/5 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:bg-black/10 focus:border-black/10 transition-all text-black placeholder-black/30"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isPosting}
            className={`text-sm font-medium uppercase px-5 py-2.5 rounded-full transition-all flex items-center justify-center gap-2 ${
              newComment.trim() && !isPosting
                ? "bg-black text-[#F0EFEB] hover:bg-black/80 cursor-pointer hover:scale-105 active:scale-95"
                : "bg-black/5 text-black/20 cursor-not-allowed"
            }`}
          >
            {isPosting ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-black/20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Posting...</span>
              </>
            ) : (
              "Post"
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CommentPopup;
