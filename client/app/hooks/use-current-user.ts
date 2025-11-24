import { useQuery } from "@tanstack/react-query";
import api from "~/lib/api";

type User = {
  id: string;
  username: string;
  email: string;
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await api.get("/auth/me");

      if (res.status === 401) {
        return null;
      }

      if (res.status !== 200) {
        throw new Error("Failed to fetch current user");
      }
      return res.data.user as User;
    },
    staleTime: 1000 * 60 * 5,
  });
}
