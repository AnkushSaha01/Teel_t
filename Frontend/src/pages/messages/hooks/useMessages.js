import { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GlobalContext } from "../../../context/Context";
import { fetchConversations, fetchChats, createGroup } from "../services/messages.api";
import { getMe } from "../../profile/services/profile.services";

export const useMessages = () => {
  const { backURI } = useContext(GlobalContext);

  // Fetch logged-in user profile
  const { data: currentUser, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMe({ backURI }),
  });

  // Fetch accepted follow relationships (conversations list)
  const { data, isLoading: isConversationsLoading, isError, error, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(backURI),
  });

  const follows = data?.follows || [];

  // Map follows to the list of messageable users
  const messageableUsers = follows
    .map((follow) => {
      if (!currentUser) return null;
      // If we followed them and they accepted, or they followed us and we accepted:
      return follow.follower._id === currentUser._id ? follow.followee : follow.follower;
    })
    

  // Remove duplicates just in case
  const uniqueUsers = Array.from(
    new Map(messageableUsers.map((user) => [user._id, user])).values()
  );

  return {
    users: uniqueUsers,
    loading: isConversationsLoading || isProfileLoading,
    error: isError ? (error?.message || "Failed to load messages") : null,
    refetch,
  };
};

export const useChats = (receiverId) => {
const { backURI } = useContext(GlobalContext);

  

  return useQuery({
    queryKey: ["chats", receiverId],
    queryFn: () => fetchChats(backURI, receiverId),
    enabled: !!receiverId,
  });
};

export default useMessages;

export const useCreateGroup = () => {
    const { backURI } = useContext(GlobalContext);

    return useMutation({
        mutationFn: ({ name, members }) => createGroup(backURI, name, members),
    });
};
