import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Media from "./Media";
import Interaction from "./Interaction";

const SinglePost = ({ post, innerRef, isSinglePage = false }) => {
  const navigate = useNavigate();
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    // If we are on the standalone single post page, we don't need to check truncation
    if (isSinglePage) return;

    const el = textRef.current;
    if (!el) return;

    // Use ResizeObserver to detect layout changes, font loads, and window resizing robustly.
    const observer = new ResizeObserver(() => {
      if (el.clientHeight > 0) {
        // scrollHeight > clientHeight + tolerance means text overflows line-clamp-3 boundaries.
        // We use a small tolerance (2px) to handle sub-pixel rendering/zoom variations.
        setIsTruncated(el.scrollHeight > el.clientHeight + 2);
      } else {
        setIsTruncated(false);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [post.content, isSinglePage]);

  return (
    <div
      ref={innerRef}
      className={`w-full text-black relative ${
        isSinglePage 
          ? "px-6 md:px-12 py-10 flex flex-col justify-start" 
          : "min-h-full shrink-0 snap-start snap-always px-6 md:px-12 pt-16 pb-36 flex flex-col justify-center"
      }`}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col justify-center">
        {/* Author Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={post?.profilePic}
            referrerPolicy="no-referrer"
            alt={post?.author}
          />
          <span className="text-lg font-medium tracking-tight text-black/60">
            {post?.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tight uppercase font-medium mb-2 md:mb-10">
          {post.title}
        </h1>
        <div className="w-1/3 border-b border-black/20 mb-2 md:mt-12"></div>

        {/* Content */}
        <p 
          ref={textRef}
          className={`text-lg md:text-2xl font-['ClashGrotesk-Variable'] leading-6 w-full text-black/85 ${isSinglePage ? "" : "line-clamp-3"}`}
        >
          {post.content}
        </p>

        {/* "See more..." trigger - only show if not on single page and text is truncated */}
        {!isSinglePage && isTruncated && (
          <span
            onClick={() => navigate(`/app/post/${post._id}`)}
            className="text-black cursor-pointer font-medium w-fit hover:underline text-xs md:text-sm mt-2 select-none"
          >
            See more...
          </span>
        )}

        {/* Media Section */}
        <Media post={post} />

        {/* Interaction Actions */}
        <Interaction
          postId={post._id}
          initialLikesCount={post.likeCount || 0}
          initialLikedState={post.isLiked || false}
          initialCommentCount={post.commentCount || 0}
        />
      </div>
    </div>
  );
};

export default SinglePost;
