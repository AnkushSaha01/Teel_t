import React, { useState } from "react";

const CreateTempGroupModal = ({ isOpen, onClose, users, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [duration, setDuration] = useState(""); // in days

  if (!isOpen) return null;

  const handleToggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0 || !duration) return;

    onCreateGroup({
      name: groupName.trim(),
      members: selectedUsers,
      duration: parseInt(duration, 10),
    });

    // Reset state
    setGroupName("");
    setSelectedUsers([]);
    setDuration("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] font-['ClashGrotesk-Variable']">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-black/10 rounded-[32px] p-6 shadow-2xl overflow-hidden animate-[scaleUp_0.3s_ease-out] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h2 className="text-xl font-medium uppercase tracking-[0.1em] text-black">
              Temporary Group
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

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Group Name Input */}
          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Self-Destruct Team"
              className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30"
              required
            />
          </div>

          {/* Group Expiry/TTL Input */}
          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
              Available Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 7"
              className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30"
              required
            />
            <p className="text-[9px] uppercase tracking-wider text-black/35 mt-1.5 px-1 font-medium">
              * Group and all its messages will self-destruct after this many days.
            </p>
          </div>

          {/* Members Selection */}
          <div className="flex-1 flex flex-col min-h-0 mb-6">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 block">
                Select Members
              </label>
              <span className="text-[10px] uppercase font-bold tracking-wider text-black/30">
                {selectedUsers.length} selected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 hide-scrollbar">
              {users.length === 0 ? (
                <div className="py-8 text-center text-xs uppercase tracking-wider text-black/40 bg-black/5 rounded-2xl">
                  No active contacts available
                </div>
              ) : (
                users.map((user) => {
                  const displayName = user.fullname || user.username;
                  const isSelected = selectedUsers.includes(user._id);

                  return (
                    <div
                      key={user._id}
                      onClick={() => handleToggleUser(user._id)}
                      className={`flex items-center justify-between p-3 bg-white/50 hover:bg-white border rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-black shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                          : "border-black/5 hover:border-black/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.profilePic ||
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
                          <span className="text-[9px]  tracking-wider text-black/40 mt-1">
                            @{user.username}
                          </span>
                        </div>
                      </div>

                      {/* Custom Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "bg-black border-black"
                            : "border-black/20"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-3 h-3 text-[#f0efeb]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors rounded-full text-center border border-black/10 bg-black/5 hover:bg-black/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedUsers.length === 0 || !duration}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.15em] bg-black text-[#f0efeb] rounded-full text-center transition-all duration-300 hover:bg-black/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTempGroupModal;
