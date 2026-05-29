import React, { useState, useEffect } from "react";

const EditProfileModal = ({ isOpen, onClose, user, onSave, isSaving, error }) => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [localError, setLocalError] = useState("");

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerPicFile, setBannerPicFile] = useState(null);

  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [bannerPicPreview, setBannerPicPreview] = useState("");

  const [hasBannerError, setHasBannerError] = useState(false);
  const [hasProfileError, setHasProfileError] = useState(false);

  // Prepopulate local state when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFullname(user.fullname || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setProfilePicPreview(user.profilePic || "");
      setBannerPicPreview(user.bannerPic || "");
      setProfilePicFile(null);
      setBannerPicFile(null);
      setLocalError("");
      setHasBannerError(false);
      setHasProfileError(false);
    }
  }, [isOpen, user]);

  // Reset error flags when preview updates (e.g. user selects a new local file)
  useEffect(() => {
    setHasBannerError(false);
  }, [bannerPicPreview]);

  useEffect(() => {
    setHasProfileError(false);
  }, [profilePicPreview]);

  if (!isOpen) return null;

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError("images must be under 5mb only");
        return;
      }
      setLocalError("");
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError("images must be under 5mb only");
        return;
      }
      setLocalError("");
      setBannerPicFile(file);
      setBannerPicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullname.trim() || !username.trim()) return;

    onSave({
      fullname: fullname.trim(),
      username: username.trim(),
      bio: bio.trim(),
      profilePic: profilePicFile,
      bannerPic: bannerPicFile,
    });
  };

  return (
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
              Edit Profile
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
            
            {/* Custom Banner Upload Preview */}
            <div className="relative">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block px-1">
                Banner Image
              </span>
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-black/5 border border-black/10 cursor-pointer group flex items-center justify-center shadow-inner">
                {bannerPicPreview && !hasBannerError ? (
                  <img
                    src={bannerPicPreview}
                    alt="Banner Preview"
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    onError={() => setHasBannerError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-900 opacity-60 animate-[fadeIn_0.3s]" />
                )}
                
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1.5 text-white bg-black/40 absolute inset-0 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Change Banner</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerPicChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Custom Avatar Upload Preview */}
            <div className="relative flex flex-col items-center -mt-10 z-10">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-[#f0efeb] shadow-md group cursor-pointer flex items-center justify-center">
                <img
                  src={
                    hasProfileError || !profilePicPreview
                      ? "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"
                      : profilePicPreview
                  }
                  alt="Avatar Preview"
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  onError={() => setHasProfileError(true)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-black/45 mt-1">
                Upload Avatar
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                className="w-full bg-black/5 rounded-full px-5 py-3.5 text-sm focus:outline-none border border-black/5 focus:border-black/20 focus:bg-white transition-all duration-300 text-black placeholder-black/30"
                required
              />
            </div>

            {/* Bio Textarea */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-2 block">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows="3"
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
              disabled={!fullname.trim() || !username.trim() || isSaving}
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
    </div>
  );
};

export default EditProfileModal;
