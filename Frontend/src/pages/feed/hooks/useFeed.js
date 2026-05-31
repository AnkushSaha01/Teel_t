import { useContext } from "react";
import { GlobalContext } from "../../../context/Context";
import { fetchFeed, fetchPostById } from "../services/feed.api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useFeed = () => {
  const { backURI } = useContext(GlobalContext);

  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => {
      console.log("pageParam", pageParam);
      return fetchFeed(backURI, pageParam);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null,
  });
};

export const useSinglePost = (postId) => {
  const { backURI } = useContext(GlobalContext);

  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(backURI, postId),
    enabled: !!postId,
  });
};
