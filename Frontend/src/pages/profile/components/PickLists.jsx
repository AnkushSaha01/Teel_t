import React, { useState, useContext } from "react";
import PickListTile from "./PickListTile";
import CreatePickListModal from "./CreatePickListModal";
import { GlobalContext } from "../../../context/Context";
import { usePicklist, useCreatePicklist } from "../hooks/useProfile";

const PickLists = ({ userId, isOwnProfile }) => {
  const { backURI } = useContext(GlobalContext);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: picklist, isLoading } = usePicklist({ backURI, userId });
  const createPicklistMutation = useCreatePicklist(userId);

  const handleSavePicklist = (picklistData) => {
    setErrorMsg("");
    createPicklistMutation.mutate(
      { backURI, picklistData },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
        },
        onError: (err) => {
          setErrorMsg(err?.response?.data?.message || "Failed to save picklist item");
        },
      }
    );
  };

  return (
    <div className="space-y-4 font-['ClashGrotesk-Variable']">
      
      {/* Picklist Items List */}
      {isLoading ? (
        <div className="w-full text-center text-black/50 py-10 uppercase tracking-widest text-xs">
          Loading picklists...
        </div>
      ) : picklist && picklist.length > 0 ? (
        <div className="flex flex-col gap-3">
          {picklist.map((item) => (
            <PickListTile key={item._id} item={item} isOwnProfile={isOwnProfile} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center text-black/40 py-12 uppercase tracking-widest text-xs font-medium">
          No picklist items saved yet.
        </div>
      )}

      {/* Add New Picklist Button - Rendered only for Owner */}
      {isOwnProfile && (
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="w-fit bg-white/60 hover:bg-white active:scale-95 border border-black/20 hover:border-black/35 rounded-2xl py-2.5 px-4 flex items-center gap-3 transition-all duration-200 cursor-pointer shadow-sm"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="font-semibold text-xs uppercase tracking-wider">add a new picklist</span>
        </button>
      )}

      {/* Create Picklist Modal */}
      <CreatePickListModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setErrorMsg("");
        }}
        onSave={handleSavePicklist}
        isSaving={createPicklistMutation.isPending}
        error={errorMsg}
      />
    </div>
  );
};

export default PickLists;
