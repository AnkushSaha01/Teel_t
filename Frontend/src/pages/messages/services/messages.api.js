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


export const createGroup = async (backURI, name, members) => {
    const res = await axios.post(`${backURI}/group/create-group`, {name, members}, {
        withCredentials: true,
    });
    return res.data;
}
