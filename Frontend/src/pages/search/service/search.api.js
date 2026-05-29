import axios from "axios";

export const fetchUsers = async ({ queryKey }) => {
    const [_key, query, backURI] = queryKey;
    if (!query) return [];
    
    const res = await axios.get(`${backURI}/user/search?q=${query}`, {
      withCredentials: true,
    });
    return res.data.users;
};

export const followUser = async (userId,backURI) => {
  const res = await axios.post(`${backURI}/follow/${userId}`, {}, {
    withCredentials: true,
  });
  return res.data;
};

export const unfollowUser = async (userId, backURI) => {
  const res = await axios.post(`${backURI}/follow/unfollow/${userId}`, {}, {
    withCredentials: true,
  });
  return res.data;
};
