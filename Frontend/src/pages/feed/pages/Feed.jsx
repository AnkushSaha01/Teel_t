import { useEffect, useRef } from "react";
import SinglePost from "../components/SinglePost";
import { useFeed } from "../hooks/useFeed";
import { useInView } from "react-intersection-observer";

const Feed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useFeed();

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
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !hasTriggeredForCurrentView.current
    ) {
      hasTriggeredForCurrentView.current = true; // Lock it
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending")
    return (
      <div className="w-full h-full flex items-center justify-center text-black/50 uppercase tracking-widest text-xs">
        Loading...
      </div>
    );

  if (status === "error")
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500 uppercase tracking-widest text-xs">
        Error loading posts
      </div>
    );

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div
      className="w-full h-[calc(100vh-96px)] overflow-y-scroll snap-y snap-mandatory flex flex-col font-['ClashGrotesk-Variable'] hide-scrollbar "
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
          <SinglePost
            key={post._id}
            post={post}
            innerRef={isLastElement ? ref : null}
          />
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
