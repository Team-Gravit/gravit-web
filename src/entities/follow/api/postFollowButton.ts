import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";

const followUser = async (id: number): Promise<void> => {
	await api.friend.following(id);
};

const unfollowUser = async (id: number): Promise<void> => {
	await api.friend.unFollowing(id);
};

export const useToggleFollowModal = (type: "followers" | "following") => {
	return useMutation<void, unknown, number>({
		mutationFn: async (id: number) => {
			if (type === "following") {
				await unfollowUser(id);
			} else {
				await followUser(id);
			}
		},
	});
};
