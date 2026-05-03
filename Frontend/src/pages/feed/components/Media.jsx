import React from "react";

const Media = ({post}) => {
  return (
    <div>
      {post.media && post.media.length > 0 && (
        <div
          className={`grid gap-1 rounded-2xl overflow-hidden border border-black/5 mt-6 mb-8 bg-zinc-100 ${
            post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
          style={{ aspectRatio: post.media.length === 1 ? "auto" : "1.91/1" }}
        >
          {post.media.slice(0, 4).map((item, index) => {
            // Logic for 3 items: first item spans 2 rows
            const isFirstOfThree = post.media.length === 3 && index === 0;

            return (
              <div
                key={item._id || index}
                className={`relative overflow-hidden ${
                  isFirstOfThree ? "row-span-2 h-full" : "h-full"
                } ${post.media.length === 1 ? "max-h-[500px]" : ""}`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={`Media ${index}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay for more items */}
                {index === 3 && post.media.length > 4 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl font-bold">
                    +{post.media.length - 4}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Media;
