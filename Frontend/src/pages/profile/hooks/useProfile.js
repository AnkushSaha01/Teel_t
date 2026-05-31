import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMe, 
  updateProfile, 
  getUserById, 
  getUserPosts, 
  deletePostApi, 
  updatePostApi,
  getPicklistApi,
  createPicklistApi,
  deletePicklistApi,
  updatePicklistApi
} from "../services/profile.services";

const useProfile = ({ backURI, accessToken }) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getMe({ backURI }),
    enabled: !!accessToken,
  });
};

const useUserProfile = ({ backURI, userId }) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserById({ backURI, userId }),
    enabled: !!userId,
  });
};

const useUserPosts = ({ backURI, authorId }) => {
  return useQuery({
    queryKey: ["userPosts", authorId],
    queryFn: () => getUserPosts({ backURI, authorId }),
    enabled: !!authorId,
  });
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ backURI, profileData }) => updateProfile({ backURI, profileData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ backURI, postId }) => deletePostApi({ backURI, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ backURI, postId, title, content }) => updatePostApi({ backURI, postId, title, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

const usePicklist = ({ backURI, userId }) => {
  return useQuery({
    queryKey: ["picklist", userId],
    queryFn: () => getPicklistApi({ backURI, userId }),
    enabled: !!userId,
  });
};

const useCreatePicklist = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ backURI, picklistData }) => createPicklistApi({ backURI, picklistData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["picklist", userId] });
    },
  });
};

const useDeletePicklist = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ backURI, picklistId }) => deletePicklistApi({ backURI, picklistId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["picklist", userId] });
    },
  });
};

const useUpdatePicklist = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ backURI, picklistId, title, description, category }) => updatePicklistApi({ backURI, picklistId, title, description, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["picklist", userId] });
    },
  });
};

export { 
  useProfile, 
  useUpdateProfile, 
  useUserProfile, 
  useUserPosts, 
  useDeletePost, 
  useUpdatePost,
  usePicklist,
  useCreatePicklist,
  useDeletePicklist,
  useUpdatePicklist
};