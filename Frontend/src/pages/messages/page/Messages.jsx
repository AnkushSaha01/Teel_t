import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMessages, { useCreateGroup, useUserGroups } from "../hooks/useMessages";
import MessagesDropdown from "../components/MessagesDropdown";
import CreateGroupModal from "../components/CreateGroupModal";
import CreateTempGroupModal from "../components/CreateTempGroupModal";

const Messages = () => {
  const navigate = useNavigate();
  const { users, loading, error, refetch } = useMessages();
  const { data: groups, isLoading: isGroupsLoading, refetch: refetchGroups } = useUserGroups();
  const [activeTab, setActiveTab] = useState("peoples");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateTempGroupOpen, setIsCreateTempGroupOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const createGroup = useCreateGroup();

  const handleCreateGroup = (groupData) => {
    console.log("Group creation payload:", groupData);
    createGroup.mutate(groupData, {
      onSuccess: () => {
        refetchGroups();
        setToastMessage(`Group "${groupData.name}" created successfully!`);
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
      }
    });
  };

  const handleCreateTempGroup = (groupData) => {
    console.log("Temp Group creation payload:", groupData);
    createGroup.mutate(groupData, {
      onSuccess: () => {
        refetchGroups();
        setToastMessage(`Temporary Group "${groupData.name}" created for ${groupData.duration} days!`);
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center font-['ClashGrotesk-Variable']">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full border-2 border-black/10 border-t-black animate-spin"></div>
          <span className="text-xs uppercase tracking-[0.2em] text-black/40">
            Loading chats...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center font-['ClashGrotesk-Variable'] px-6 text-center">
        <div className="text-red-500 uppercase tracking-widest text-xs mb-4">
          {error}
        </div>
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
        <div className="mb-5">
          <div className="flex justify-between  items-center mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight uppercase leading-none ">
              Messages
            </h1>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-black/5 active:scale-95 flex items-center justify-center text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </button>
              <MessagesDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onCreateGroup={() => setIsCreateGroupOpen(true)}
                onCreateTempGroup={() => setIsCreateTempGroupOpen(true)}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <button
              onClick={() => setActiveTab("peoples")}
              className={`text-sm tracking-tight uppercase leading-none px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === "peoples"
                  ? "bg-black/10 border border-black/20 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-black"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              Peoples
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`text-sm tracking-tight uppercase leading-none px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === "groups"
                  ? "bg-black/10 border border-black/20 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-black"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              Groups
            </button>
          </div>

          <div className="w-full h-px bg-black/15 mt-2"></div>
        </div>

        {/* Dynamic List rendering based on Active Tab */}
        {activeTab === "peoples" ? (
          users.length === 0 ? (
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
                    d="M20.25 8.511c.083.185.13.39.13.606v5.367c0 .807-.653 1.46-1.46 1.46H6.25c-.807 0-1.46-.653-1.46-1.46V9.117c0-.216.047-.421.13-.606m15.33 0c-.299-.665-.965-1.127-1.74-1.127H5.16c-.775 0-1.441.462-1.74 1.127m16.83 0c.162.361.25.76.25 1.18 0 .42-.088.82-.25 1.18m-16.83 0A4.75 4.75 0 0 1 3.125 9.12c0-.42.088-.82.25-1.18m16.58 0a4.75 4.75 0 0 0-4.75-4.75h-6.4a4.75 4.75 0 0 0-4.75 4.75m16.58 0v1.18m-16.58-1.18v1.18m0 0c.299.665.965 1.127 1.74 1.127h13.68c.775 0 1.441-.462 1.74-1.127M12 12.25c-2.347 0-4.25-1.903-4.25-4.25S9.653 3.75 12 3.75 16.25 5.653 16.25 8 14.347 12.25 12 12.25Z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium uppercase tracking-wider mb-2">
                No active chats
              </h2>
              <p className="text-xs uppercase tracking-wider text-black/40 max-w-sm leading-relaxed">
                Accept follow requests or connect with people to start direct
                messaging.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {users.map((user) => {
                const displayName = user.fullname || user.username;

                return (
                  <div
                    key={user._id}
                    onClick={() =>
                      navigate(`/app/messages/${user._id}`, { state: { user } })
                    }
                    className="w-full bg-black/10 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white animate-[scaleUp_0.4s_ease-out] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user.profilePic ||
                          "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"
                        }
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover border border-black/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <span className="text-lg  text-black leading-tight">
                          {displayName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : isGroupsLoading ? (
          <div className="w-full py-16 flex flex-col justify-center items-center">
            <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-black animate-spin mb-3"></div>
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">
              Loading groups...
            </span>
          </div>
        ) : !groups || groups.length === 0 ? (
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
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium uppercase tracking-wider mb-2">
              No Groups Yet
            </h2>
            <p className="text-xs uppercase tracking-wider text-black/40 max-w-sm leading-relaxed">
              You are not associated with any groups. Create a group from the menu options to get started!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {groups.map((group) => {
              const firstLetter = group.name ? group.name.charAt(0).toUpperCase() : "G";

              return (
                <div
                  key={group._id}
                  onClick={() =>
                    navigate(`/app/messages/group/${group._id}`, { state: { group } })
                  }
                  className="w-full bg-black/10 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white animate-[scaleUp_0.4s_ease-out] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-[#f0efeb] flex items-center justify-center font-bold text-lg border border-black/10">
                      {firstLetter}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg text-black leading-tight font-medium">
                        {group.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-black/40 mt-0.5 font-semibold">
                        {group.members?.length || 0} members
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        users={users}
        onCreateGroup={handleCreateGroup}
      />

      <CreateTempGroupModal
        isOpen={isCreateTempGroupOpen}
        onClose={() => setIsCreateTempGroupOpen(false)}
        users={users}
        onCreateGroup={handleCreateTempGroup}
      />

      {toastMessage && (
        <div className="fixed w-fit top-8 left-1/2 -translate-x-1/2 bg-black text-[#f0efeb] text-[12px]  py-3 px-6 rounded-full shadow-2xl z-50 animate-[fadeIn_0.2s_ease-out] flex justify-center items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 text-green-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Messages;
