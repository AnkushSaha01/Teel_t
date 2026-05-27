import axios from "axios";

export const fetchConversations = async (backURI) => {
  const res = await axios.get(`${backURI}/messages/get-messages`, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchChats = async (backURI, receiverId) => {
    const res = await axios.get(`${backURI}/messages/get-chats/${receiverId}`, {
        withCredentials: true,
    });
    return res.data;
}
    