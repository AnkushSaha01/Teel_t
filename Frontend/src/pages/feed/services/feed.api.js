import axios from "axios";

export const fetchFeed = async (backURI, pageParam = null) => {
  const url = pageParam 
    ? `${backURI}/post/get-post?cursor=${pageParam}&limit=3`
    : `${backURI}/post/get-post?limit=3`;

  const res = await axios.get(url, {
    withCredentials: true,
  });

  return res.data;
};