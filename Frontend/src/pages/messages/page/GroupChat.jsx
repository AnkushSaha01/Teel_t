import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useGroupChats } from "../hooks/useMessages";
import { GlobalContext } from "../../../context/Context";
import { useProfile } from "../../profile/hooks/useProfile";
import GroupDropdown from "../components/GroupDropdown";
import GroupInfoModal from "../components/GroupInfoModal";

const GroupChat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract group details passed as state through the clicked div
  const chatGroup = location.state?.group;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { backURI } = useContext(GlobalContext);
  const { data: currentUser } = useProfile({ backURI });

  const { data: groupChats, isLoading } = useGroupChats(chatGroup?._id);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !chatGroup) return;

    // Send group message
    socketRef.current.emit("send_message", {
      message,
      groupId: chatGroup._id,
    });

    const newMessage = {
      _id: Date.now().toString(),
      message: message.trim(),
      sender: currentUser?._id || "me",
      groupId: chatGroup._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    if (groupChats) {
      setMessages(
        Array.isArray(groupChats) ? groupChats : groupChats.messages || [],
      );
    }
  }, [groupChats]);

  useEffect(() => {
    if (!chatGroup?._id) return;

    const socket = io("http://localhost:3001", { withCredentials: true });
    socketRef.current = socket;

    socket.once("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("connect_error", (data) => {
      console.log(data);
    });

    socket.on("receive_message", (data) => {
      if (data.groupId === chatGroup._id) {
        if (data.sender !== currentUser?._id) {
          setMessages((prev) => [...prev, data]);
        }
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatGroup?._id, currentUser?._id]);

  if (!chatGroup) {
    return (
      <div className="w-full h-[calc(100vh-96px)] flex flex-col justify-center items-center font-['ClashGrotesk-Variable'] px-6 text-center bg-[#f0efeb]">
        <div className="text-red-500 uppercase tracking-widest text-xs mb-4">
          No group selected
        </div>
        <button
          onClick={() => navigate("/app/messages")}
          className="px-6 py-2.5 bg-black text-[#f0efeb] text-xs font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-black/80 transition-all cursor-pointer"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  const displayName = chatGroup.name;

  return (
    <div className="w-full h-dvh flex flex-col font-['ClashGrotesk-Variable'] bg-[#f0efeb]  relative">
      <div className="w-full max-w-2xl mx-auto flex flex-col h-full bg-white/40 backdrop-blur-md border border-black/10  overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Chat Header */}
        <div className="w-full px-6 py-4 flex items-center justify-between border-b border-black/10 bg-white/80">
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/app/messages")}
                className="p-2.5 bg-black/5 hover:bg-black/10 active:scale-95 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-[#f0efeb] flex items-center justify-center font-bold text-lg border border-black/10">
                  {chatGroup.name ? chatGroup.name.charAt(0).toUpperCase() : "G"}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium tracking-tight text-black leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-black/40 mt-0.5 font-semibold">
                    Group • {chatGroup.members?.length || 0} members
                  </span>
                </div>
              </div>
            </div>

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
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </button>
              <GroupDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onOpenInfo={() => setIsInfoOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div
          className="flex-1 overflow-y-auto px-6 pt-4 flex flex-col gap-4 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="w-full flex justify-center my-2">
            <span className="text-[10px] uppercase tracking-widest text-black/30 font-semibold bg-black/5 px-3 py-1 rounded-full">
              End-to-End Encrypted
            </span>
          </div>

          <div className="w-full h-full  flex flex-col gap-4">
            {messages?.map((msg) => {
              const isMe =
                msg.sender === "me" ||
                msg.sender === currentUser?._id ||
                (msg.sender?._id && msg.sender._id === currentUser?._id);
              const text = msg.message || msg.text;
              const displayTime = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : msg.time;

              const senderName =
                !isMe && msg.sender
                  ? typeof msg.sender === "object"
                    ? msg.sender.fullname || msg.sender.username
                    : msg.sender
                  : null;

              return (
                <div
                  key={msg._id || msg.id || Math.random().toString()}
                  className={`max-w-[80%] flex flex-col gap-1 transition-all duration-300 animate-[scaleUp_0.3s_ease-out] ${
                    isMe ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  {senderName && (
                    <span className="text-[10px] tracking-wide text-black/40 font-semibold px-2 uppercase mb-0.5">
                      {senderName}
                    </span>
                  )}
                  <div
                    className={`px-5 py-3.5 text-sm leading-relaxed ${
                      isMe
                        ? "bg-black text-[#f0efeb] rounded-3xl rounded-tr-none shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                        : "bg-white border border-black/10 text-black rounded-3xl rounded-tl-none shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                    }`}
                  >
                    {text}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-black/30 px-1">
                    {displayTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="w-full p-4 border-t border-black/10 bg-white/90 flex gap-2 items-center relative"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message group ${chatGroup.name}...`}
            className="w-full bg-black/5 rounded-full px-6 py-3.5 text-sm font-['ClashGrotesk-Variable'] focus:outline-none placeholder-black/30 pr-14 border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`absolute right-6 p-2 bg-black text-[#f0efeb] rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
              message.trim()
                ? "opacity-100 hover:scale-105 active:scale-95 hover:bg-black/80 cursor-pointer"
                : "opacity-40 cursor-default"
            }`}
            title="Send"
          >
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
                d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
              />
            </svg>
          </button>
        </form>
      </div>

      <GroupInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        group={chatGroup}
      />
    </div>
  );
};

export default GroupChat;
