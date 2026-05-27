import axios from "axios";

export const fetchPendingRequests = async (backURI) => {
  const res = await axios.get(`${backURI}/follow/requests`, {
    withCredentials: true,
  });
  return res.data;
};

export const acceptFollowRequest = async (backURI, followerId) => {
  const res = await axios.post(`${backURI}/follow/accept/${followerId}`, {}, {
    withCredentials: true,
  });
  return res.data;
};

export const rejectFollowRequest = async (backURI, followerId) => {
  const res = await axios.post(`${backURI}/follow/reject/${followerId}`, {}, {
    withCredentials: true,
  });
  return res.data;
};
