import React, { useEffect, useRef } from "react";

const MessagesDropdown = ({ isOpen, onClose, onCreateGroup, onCreateTempGroup }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-56 bg-white/75 backdrop-blur-xl border border-black/10 rounded-2xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 animate-[scaleUp_0.2s_ease-out] font-['ClashGrotesk-Variable']"
    >
      <div className="py-1.5 flex flex-col">
        {/* Create Group */}
        <button
          onClick={() => {
            onCreateGroup();
            onClose();
          }}
          className="w-full px-5 py-3 text-left text-sm font-medium text-black hover:bg-black/5 active:bg-black/10 flex items-center gap-3 transition-colors duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-black/70"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          <span className="uppercase tracking-wider text-xs font-semibold">Create Group</span>
        </button>

        {/* Separator line */}
        <div className="h-px bg-black/10 my-1 mx-3" />

        {/* Temporary Group */}
        <button
          onClick={() => {
            onCreateTempGroup();
            onClose();
          }}
          className="w-full px-5 py-3 text-left text-sm font-medium text-black hover:bg-black/5 active:bg-black/10 flex items-center gap-3 transition-colors duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-black/70"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="uppercase tracking-wider text-xs font-semibold">Temporary Group</span>
        </button>
      </div>
    </div>
  );
};

export default MessagesDropdown;
