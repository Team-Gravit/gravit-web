import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";

export const followUser = (id: number) =>
	apiClient.post(`/friends/following/${id}`);
export const unfollowUser = (id: number) =>
	apiClient.post(`/friends/unfollowing/${id}`);

export const useToggleFollowModal = (type: "followers" | "following") => {
	return useMutation({
		mutationFn: async (id: number) => {
			if (type === "following") {
				await unfollowUser(id);
			} else {
				await followUser(id);
			}
		},
	});
};
