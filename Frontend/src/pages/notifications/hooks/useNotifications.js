import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalContext } from "../../../context/Context";
import {
  fetchPendingRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../services/notifications.api";

export const useNotifications = () => {
  const { backURI } = useContext(GlobalContext);
  const queryClient = useQueryClient();

  // Query to fetch pending requests
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchPendingRequests(backURI),
  });

  // Mutation to accept request
  const acceptMutation = useMutation({
    mutationFn: (followerId) => acceptFollowRequest(backURI, followerId),
    onMutate: async (followerId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old) => {
        const oldRequests = old?.requests || [];
        return {
          ...old,
          requests: oldRequests.filter((r) => r.follower._id !== followerId),
        };
      });

      return { previousData };
    },
    onError: (err, followerId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mutation to reject request
  const rejectMutation = useMutation({
    mutationFn: (followerId) => rejectFollowRequest(backURI, followerId),
    onMutate: async (followerId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old) => {
        const oldRequests = old?.requests || [];
        return {
          ...old,
          requests: oldRequests.filter((r) => r.follower._id !== followerId),
        };
      });

      return { previousData };
    },
    onError: (err, followerId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    requests: data?.requests || [],
    loading: isLoading,
    error: isError ? (error?.message || "Failed to load requests") : null,
    refetch,
    
    // Accept action
    acceptRequest: acceptMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,
    
    // Reject action
    rejectRequest: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
  };
};

export const useNotification = useNotifications;
export default useNotifications;
