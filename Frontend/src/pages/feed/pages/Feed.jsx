import { useEffect, useRef } from "react";
import Media from "../components/Media";
import { useFeed } from "../hooks/useFeed";
import { useInView } from "react-intersection-observer";

const Feed = () => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    status 
  } = useFeed();

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const hasTriggeredForCurrentView = useRef(false);

  // Reset the lock when the element leaves the screen
  useEffect(() => {
    if (!inView) {
      hasTriggeredForCurrentView.current = false;
    }
  }, [inView]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !hasTriggeredForCurrentView.current) {
      hasTriggeredForCurrentView.current = true; // Lock it
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") return (
    <div className="w-full h-full flex items-center justify-center text-black/50 uppercase tracking-widest text-xs">
      Loading...
    </div>
  );

  if (status === "error") return (
    <div className="w-full h-full flex items-center justify-center text-red-500 uppercase tracking-widest text-xs">
      Error loading posts
    </div>
  );

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <div
      className="w-full h-[calc(100vh-96px)] overflow-y-scroll snap-y snap-mandatory flex flex-col font-[GeneralSans-Regular] hide-scrollbar "
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {allPosts.length === 0 && (
        <div className="w-full h-full shrink-0 flex flex-col justify-center items-center px-6 text-black/50 uppercase tracking-widest text-xs">
          No posts available.
        </div>
      )}

      {allPosts.map((post, index) => {
        const isLastElement = allPosts.length === index + 1;
        return (
          <div
            key={post._id}
            ref={isLastElement ? ref : null}
            className="w-full h-full shrink-0 snap-start snap-always px-6 md:px-12 flex flex-col justify-center text-black "
          >
            <div className="w-full min-h-[60%] ">
              <div className="flex items-start gap-4 mb-10">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={post?.profilePic}
                  referrerPolicy="no-referrer"
                  alt={post?.author}
                />
                <span className="text-[20px] md:text-xs font-medium tracking-tight  text-black/60 mb-4 md:mb-6">
                  {post?.author}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tighter uppercase font-medium mb-6 md:mb-10">
                {post.title}
              </h1>

              <p className="text-lg md:text-2xl font-[GeneralSans-Light] uppercase leading-relaxed max-w-3xl">
                {post.content}
              </p>
              {/* Adding a sleek bottom border separator for aesthetic context */}
              <div className="w-1/3 border-b border-black/20 mb-6  md:mt-12"></div>
              {/* Media Section */}
              <Media post={post} />
            </div>
          </div>
        );
      })}

      {isFetchingNextPage && (
        <div className="w-full py-10 flex justify-center text-black/50 uppercase tracking-widest text-xs">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default Feed;
