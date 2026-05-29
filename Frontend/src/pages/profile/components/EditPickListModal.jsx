import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const EditPickListModal = ({ isOpen, onClose, item, onSave, isSaving, error }) => {
  const [category, setCategory] = useState("Outfit");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState("");

  const categories = ['Outfit', 'Makeup', 'Hair', 'Shoes', 'Accessories', 'Other'];

  // Prepopulate local state when modal opens
  useEffect(() => {
    if (isOpen && item) {
      setCategory(item.category || "Outfit");
      setTitle(item.title || "");
      setDescription(item.description || "");
      setLocalError("");
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim() || !title.trim()) {
      setLocalError("Category and title are required");
      return;
    }
    setLocalError("");
    onSave({
      category: category.trim(),
      title: title.trim(),
      description: description.trim(),
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
              Edit Picklist
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
            
            {/* Category Dropdown Select */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Item Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30 appearance-none cursor-pointer"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="text-black font-sans bg-white">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-black/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Item Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title..."
                className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30"
                required
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Item Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows="4"
                className="w-full bg-black/5 rounded-2xl px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30 resize-none hide-scrollbar animate-[fadeIn_0.3s]"
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
              disabled={!category.trim() || !title.trim() || isSaving}
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

export default EditPickListModal;
