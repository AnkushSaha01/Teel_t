import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "../service/search.api";

export default function useUnfollow({ backURI }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => unfollowUser(userId, backURI),
    onSuccess: () => {
      // Invalidate users to update search results and UI state dynamically
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
