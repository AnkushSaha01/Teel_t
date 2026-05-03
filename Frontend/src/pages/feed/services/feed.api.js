import axios from "axios";

export const fetchFeed = async (backURI) => {

  const res = await axios.get(`${backURI}/post/get-post`, {
    withCredentials: true,
  });

  return res.data.posts;
};