import React from "react";
import { useNotification } from "../hooks/useNotifications";

const Notifications = () => {
  const {
    requests,
    loading,
    error,
    refetch,
    acceptRequest,
    isAccepting,
    rejectRequest,
    isRejecting,
  } = useNotification();

  const isProcessing = isAccepting || isRejecting;

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center font-['ClashGrotesk-Variable']">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full border-2 border-black/10 border-t-black animate-spin"></div>
          <span className="text-xs uppercase tracking-[0.2em] text-black/40">Fetching Requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center font-['ClashGrotesk-Variable'] px-6 text-center">
        <div className="text-red-500 uppercase tracking-widest text-xs mb-4">{error}</div>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-black text-[#f0efeb] text-xs font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-black/80 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-96px)] overflow-y-scroll flex flex-col font-['ClashGrotesk-Variable'] hide-scrollbar px-6 md:px-12 pt-12 pb-36 bg-[#f0efeb]">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="w-full max-w-2xl mx-auto">
        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight uppercase leading-none mb-4">
            Notifications
          </h1>
          <div className="flex justify-between items-center text-xs uppercase tracking-[0.15em] text-black/50">
            <span>Pending Requests</span>
            <span className="font-semibold text-black bg-black/5 px-2.5 py-1 rounded-full">
              {requests.length}
            </span>
          </div>
          <div className="w-full h-px bg-black/15 mt-6"></div>
        </div>

        {/* List of Requests */}
        {requests.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="p-5 bg-white/40 backdrop-blur-md border border-black/5 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-8 h-8 text-black/40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.97 5.97 0 0 0-.75-2.906m-.173-4.059a5 5 0 1 1-9.918 0m9.918 0a5.002 5.002 0 0 1-9.288 2.525M15 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6.3-2.288a3 3 0 0 0-2.248-.054M5 7.5a3 3 0 0 1 3-3M2.1 5.212a3 3 0 0 0 2.248.055"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium uppercase tracking-wider mb-2">You're all caught up</h2>
            <p className="text-xs uppercase tracking-wider text-black/40 max-w-sm leading-relaxed">
              When people request to follow you, their pending requests will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((request) => {
              const follower = request.follower;
              if (!follower) return null;
              
              const hasName = !!follower.fullname;
              const displayName = follower.fullname || follower.username;

              return (
                <div
                  key={request._id}
                  className="w-full bg-white/60 backdrop-blur-md border border-black/10 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white animate-[scaleUp_0.4s_ease-out]"
                >
                  {/* Left: User Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={follower.profilePic || "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover border border-black/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-medium tracking-tight text-black leading-tight">
                        {displayName}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-black/50 mt-0.5">
                        {hasName ? `@${follower.username}` : follower.email}
                      </span>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      disabled={isProcessing}
                      onClick={() => rejectRequest(follower._id)}
                      className={`px-5 py-2.5 bg-black/5 text-black text-xs font-semibold tracking-[0.15em] uppercase rounded-full hover:bg-black/10 hover:scale-105 active:scale-95 transition-all duration-300 ${
                        isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Reject
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => acceptRequest(follower._id)}
                      className={`px-5 py-2.5 bg-black text-[#f0efeb] text-xs font-semibold tracking-[0.15em] uppercase rounded-full hover:bg-black/80 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                        isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;