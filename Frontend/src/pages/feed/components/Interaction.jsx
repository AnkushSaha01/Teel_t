import React, { useState } from "react";

const Interaction = ({ postId }) => {
  // Initialize realistic mock counters based on postId hash
  const seed = postId ? postId.charCodeAt(postId.length - 1) : 42;
  const initialLikes = (seed * 3) % 180 + 12;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "alex_design",
      text: "This is absolutely stunning! The typography fits perfectly. 🔥",
      time: "2h ago"
    },
    {
      id: 2,
      author: "sarah_k",
      text: "Low-key one of the best presentations I've seen in a while.",
      time: "1h ago"
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: "you",
        text: newComment,
        time: "Just now"
      }
    ]);
    setNewComment("");
  };

  return (
    <div className="w-full font-['ClashGrotesk-Variable'] mt-6">
      {/* Interaction Icons Bar */}
      <div className="flex items-center gap-6 text-black/80 relative py-2">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-0.5 group transition-all duration-300 ${
            liked ? "text-red-500 scale-105" : "hover:text-black hover:scale-105"
          }`}
          aria-label="Like"
        >
          <div className="p-2 rounded-full hover:bg-black/5 transition-colors">
            {liked ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-transform duration-300 animate-[bounce_0.3s_ease-in-out]">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 transition-transform duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </div>
          <span className="text-xs font-medium tracking-wide">{likesCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-0.5 group transition-all duration-200 hover:text-black hover:scale-105 ${
            showComments ? "text-black" : ""
          }`}
          aria-label="Comment"
        >
          <div className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 4.5 4.5 0 003.355-1.003c.489-.136 1.034-.143 1.517.034.9.33 1.885.512 2.894.512z" />
            </svg>
          </div>
          <span className="text-xs font-medium tracking-wide">{comments.length}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center group transition-all duration-200 hover:text-black hover:scale-105"
          aria-label="Share"
        >
          <div className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </div>
        </button>

        {/* Copy Success Toast */}
        {showToast && (
          <div className="absolute left-0 -top-8 bg-black text-[#F0EFEB] text-[10px] font-normal tracking-widest uppercase py-1.5 px-4 rounded-full shadow-md animate-fade-in-out transition-all">
            Link Copied!
          </div>
        )}
      </div>

      {/* Expandable Comments Drawer Section */}
      {showComments && (
        <div className="mt-4 border-t border-black/5 pt-4 animate-[slideDown_0.2s_ease-out]">
          <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-1 hide-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-sm items-start py-1">
                {/* Micro avatar */}
                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                  {comment.author[0]}
                </div>
                <div className="flex flex-col bg-black/5 px-3.5 py-2 rounded-2xl max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs lowercase">@{comment.author}</span>
                    <span className="text-[9px] text-black/35 font-medium">{comment.time}</span>
                  </div>
                  <p className="text-black/85 text-xs mt-1 leading-normal font-light">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Reply Input Box */}
          <form onSubmit={handleAddComment} className="flex gap-3 items-center mt-4">
            <div className="w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
              Y
            </div>
            <input
              type="text"
              placeholder="Add a reply..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-black/5 border-none rounded-full px-4 py-2 text-xs focus:outline-none focus:bg-black/10 transition-colors text-black placeholder-black/30"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                newComment.trim()
                  ? "bg-black text-[#F0EFEB] hover:bg-black/80 cursor-pointer"
                  : "bg-black/5 text-black/20 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Interaction;