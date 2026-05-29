import React, { useEffect, useRef } from "react";

const GroupDropdown = ({ isOpen, onClose, onOpenInfo }) => {
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
      <div className="py-2 flex flex-col">
        <button
          onClick={() => {
            onOpenInfo();
            onClose();
          }}
          className="w-full px-5 py-3.5 text-left text-sm font-medium text-black hover:bg-black/5 active:bg-black/10 flex items-center gap-3 transition-colors duration-200 cursor-pointer"
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
              d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <span className="uppercase tracking-wider text-xs font-semibold">Info</span>
        </button>
      </div>
    </div>
  );
};

export default GroupDropdown;
