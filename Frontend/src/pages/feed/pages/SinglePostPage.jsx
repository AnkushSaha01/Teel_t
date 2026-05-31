import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSinglePost } from "../hooks/useFeed";
import SinglePost from "../components/SinglePost";

const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useSinglePost(id);

  if (isLoading) {
    return (
      <div className="w-full flex-1 min-h-[calc(100vh-96px)] flex items-center justify-center text-black/55 uppercase tracking-widest text-xs font-semibold ">
        Loading post...
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="w-full flex-1 min-h-[calc(100vh-96px)] flex flex-col items-center justify-center gap-6 text-red-500 uppercase tracking-widest text-xs font-semibold">
        <span>Error loading post or post not found.</span>
        <button
          onClick={() => navigate("/app/feed")}
          className="bg-black text-[#F0EFEB] text-[10px] font-bold tracking-[0.2em] uppercase py-3 px-8 hover:bg-black/80 transition-colors cursor-pointer select-none"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-[#f0efeb] overflow-y-auto animate-[fadeIn_0.25s_ease-out] mb-20 ">
      {/* Sleek Back Navigation Icon Bar */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black/60 hover:text-black uppercase text-[10px] md:text-xs tracking-widest font-bold transition-colors cursor-pointer select-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Render modular SinglePost in detailed format */}
      <SinglePost post={post} isSinglePage={true} />
    </div>
  );
};

export default SinglePostPage;
