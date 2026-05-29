import React, { useState, useRef, useEffect, useContext } from "react";
import { GlobalContext } from "../../../context/Context";
import { useDeletePicklist, useUpdatePicklist } from "../hooks/useProfile";
import EditPickListModal from "./EditPickListModal";

const PickListTile = ({ item, isOwnProfile }) => {
  if (!item) return null;

  const { backURI } = useContext(GlobalContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dropdownRef = useRef(null);

  const deletePicklistMutation = useDeletePicklist(item.user);
  const updatePicklistMutation = useUpdatePicklist(item.user);

  // Format link for external href safety
  const formattedHref = item.item.startsWith("http") ? item.item : `https://${item.item}`;

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleCardClick = () => {
    window.open(formattedHref, "_blank", "noopener,noreferrer");
  };

  const handleThreeDotsClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(false);
    if (window.confirm("Are you sure you want to delete this picklist item?")) {
      deletePicklistMutation.mutate({ backURI, picklistId: item._id });
    }
  };

  const handleSaveEdit = (editedData) => {
    setErrorMsg("");
    updatePicklistMutation.mutate(
      {
        backURI,
        picklistId: item._id,
        title: editedData.title,
        description: editedData.description,
        category: editedData.category,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
        onError: (err) => {
          setErrorMsg(err?.response?.data?.message || "Failed to update picklist item");
        },
      }
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-black/10 bg-white/80 backdrop-blur-sm rounded-2xl p-3 flex items-start justify-between gap-4 shadow-sm hover:shadow hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 relative cursor-pointer"
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/5 flex items-center justify-center bg-zinc-50 p-2 shadow-inner">
          <img
            src={item.icon || "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"}
            alt=""
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png";
            }}
          />
        </div>
        <div className="flex flex-col gap-1 min-h-16 justify-center flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-base text-black max-w-[200px] md:max-w-[320px] truncate leading-tight">
              {item.title}
            </span>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-black/5 rounded-full text-black/50 font-sans">
              {item.category}
            </span>
          </div>
          <span className="leading-tight text-sm text-black/60 line-clamp-2">
            {item.description || "No description provided."}
          </span>
        </div>
      </div>

      {isOwnProfile && (
        <div className="relative z-10" ref={dropdownRef}>
          <button
            onClick={handleThreeDotsClick}
            className="p-1.5 hover:bg-black/5 active:scale-95 rounded-full transition-all duration-200 cursor-pointer text-black/60 hover:text-black flex items-center justify-center"
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
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>

          {/* Glassmorphic Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white/95 backdrop-blur-md border border-black/10 rounded-2xl shadow-xl z-20 py-2 animate-[fadeIn_0.15s_ease-out] font-sans">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowDropdown(false);
                  setIsEditOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black/75 hover:text-black hover:bg-black/5 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
                Edit Pick
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete Pick
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Picklist Modal */}
      <EditPickListModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setErrorMsg("");
        }}
        item={item}
        onSave={handleSaveEdit}
        isSaving={updatePicklistMutation.isPending}
        error={errorMsg}
      />
    </div>
  );
};

export default PickListTile;
