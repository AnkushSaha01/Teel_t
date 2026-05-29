import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const EditPostModal = ({ isOpen, onClose, post, onSave, isSaving, error }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [localError, setLocalError] = useState("");

  // Prepopulate local state when modal opens
  useEffect(() => {
    if (isOpen && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setLocalError("");
    }
  }, [isOpen, post]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setLocalError("Title and content are required");
      return;
    }
    setLocalError("");
    onSave({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return createPortal(
    <div 
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] font-['ClashGrotesk-Variable']"
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-black/10 rounded-[32px] p-6 shadow-2xl overflow-hidden animate-[scaleUp_0.3s_ease-out] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            <h2 className="text-xl font-medium uppercase tracking-[0.1em] text-black">
              Edit Post
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-black/5 hover:bg-black/10 active:scale-95 rounded-full transition-all duration-200 cursor-pointer text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {(error || localError) && (
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200 animate-[fadeIn_0.2s]">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 hide-scrollbar mb-6">
            
            {/* Title */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30"
                required
              />
            </div>

            {/* Caption Textarea */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Post Caption
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?..."
                rows="4"
                className="w-full bg-black/5 rounded-2xl px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30 resize-none hide-scrollbar animate-[fadeIn_0.3s]"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors rounded-full text-center border border-black/10 bg-black/5 hover:bg-black/10 cursor-pointer disabled:opacity-55"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSaving}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.15em] bg-black text-[#f0efeb] rounded-full text-center transition-all duration-300 hover:bg-black/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditPostModal;
