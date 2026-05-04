import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser } from "../service/search.api";

export default function useFollow({ backURI }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => followUser(userId, backURI),
    onSuccess: () => {
      // Invalidate users to update any UI states
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}