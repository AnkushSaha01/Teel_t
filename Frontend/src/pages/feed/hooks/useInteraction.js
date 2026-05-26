import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likePostAPI } from "../services/interaction.api";
import { getCommentsByPostId, createComment } from "../services/comment.api";
import { GlobalContext } from "../../../context/Context";

const useInteraction = (postId) => {
  const { backURI } = useContext(GlobalContext);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (id) => likePostAPI(backURI, id || postId),
    onSuccess: () => {
      // Invalidate the feed query to automatically update the feed counts
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  // Query to fetch and cache comments for a specific post
  const commentsQuery = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(backURI, postId),
    enabled: !!postId,
  });

  // Mutation to create a new comment
  const commentMutation = useMutation({
    mutationFn: (content) => createComment(backURI, postId, content),
    onMutate: async (newCommentText) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Snapshot the previous comments data
      const previousCommentsData = queryClient.getQueryData(["comments", postId]);

      // Retrieve the logged-in user profile from the query cache if available
      const profileData = queryClient.getQueryData(["profile"]);
      const currentUser = profileData || { username: "user", profilePic: "" };

      // Construct the optimistic comment object matching the populated backend format
      const optimisticComment = {
        _id: `temp-${Date.now()}`,
        content: newCommentText,
        postId,
        userId: {
          _id: currentUser._id || "temp-user-id",
          username: currentUser.username || "user",
          profilePic: currentUser.profilePic || "",
        },
        createdAt: new Date().toISOString(),
      };

      // Optimistically update the comments query cache
      queryClient.setQueryData(["comments", postId], (old) => {
        const oldComments = old?.comments || [];
        return {
          ...old,
          comments: [...oldComments, optimisticComment],
        };
      });

      // Return context to rollback if things go wrong
      return { previousCommentsData };
    },
    onError: (err, newCommentText, context) => {
      // Rollback to the previous state on error
      if (context?.previousCommentsData) {
        queryClient.setQueryData(["comments", postId], context.previousCommentsData);
      }
    },
    onSuccess: (data) => {
      // Ensure the query cache is updated with the exact server response once succeeded
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return {
    likePost: likeMutation.mutateAsync,
    isLoading: likeMutation.isPending,
    isError: likeMutation.isError,
    error: likeMutation.error,
    data: likeMutation.data,

    // Comments query data and states
    comments: commentsQuery.data?.comments || [],
    isCommentsLoading: commentsQuery.isLoading,
    isCommentsError: commentsQuery.isError,

    // Comments mutation trigger and states
    createComment: commentMutation.mutateAsync,
    isCommentCreating: commentMutation.isPending,
  };
};

export default useInteraction;