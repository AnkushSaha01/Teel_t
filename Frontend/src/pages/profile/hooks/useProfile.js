import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/profile.services";

const useProfile = ({ backURI }) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getMe({ backURI }),
  });
};

export { useProfile };