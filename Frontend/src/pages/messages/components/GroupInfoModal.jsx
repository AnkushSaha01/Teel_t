import React from "react";

const GroupInfoModal = ({ isOpen, onClose, group }) => {
  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] font-['ClashGrotesk-Variable']">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-black/10 rounded-[32px] p-6 shadow-2xl overflow-hidden animate-[scaleUp_0.3s_ease-out] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-medium uppercase tracking-[0.1em] text-black">
              Group Info
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-bold text-black/40 mt-0.5">
              {group.name}
            </span>
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

        {/* Member list section */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 block">
              Members ({group.members?.length || 0})
            </label>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 hide-scrollbar">
            {group.members?.map((member) => {
              const displayName = member.fullname || member.username;
              const adminId = typeof group.admin === "object" ? group.admin._id : group.admin;
              const isAdmin = adminId === member._id;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-white/50 border border-black/5 rounded-2xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.profilePic ||
                        "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"
                      }
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover border border-black/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-black leading-none">
                        {displayName}
                      </span>
                      <span className="text-[9px] tracking-wider text-black/40 mt-1">
                        @{member.username}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-white bg-black px-2.5 py-1 rounded-full border border-black/10">
                      Admin
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 text-xs font-bold uppercase tracking-[0.15em] bg-black text-[#f0efeb] rounded-full text-center transition-all duration-300 hover:bg-black/80 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;
