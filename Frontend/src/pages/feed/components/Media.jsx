import React, {useRef, useEffect} from "react";

const Media = ({ post }) => {
  if (!post.media || post.media.length === 0) return null;

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <div className="w-full flex overflow-x-auto gap-3 snap-x snap-mandatory hide-scrollbar mt-2 mb-2 py-1">
      {post.media.map((item, index) => (
        <div
          key={item._id || index}
          className="h-[320px] md:h-[420px] w-auto shrink-0 snap-start rounded-2xl overflow-hidden border border-black/5 bg-zinc-100 relative flex items-center justify-center"
        >
          {item.type === "image" ? (
            <img
              src={item.url}
              alt={`Media ${index}`}
              className="h-full w-auto block object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              className="h-full w-auto block object-contain"
            >
              <source src={item.url} type="video/mp4" />
            </video>
          )}
        </div>
      ))}
    </div>
  );
};

export default Media;
