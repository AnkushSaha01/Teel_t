import { useContext } from "react";
import { GlobalContext } from "../../../context/Context";
import { fetchFeed } from "../services/feed.api";
import { useInfiniteQuery } from "@tanstack/react-query";

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
