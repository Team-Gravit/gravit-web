import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { Friend } from "@/entities/friends/model/types";

const followFriend = (id: number) => apiClient.post(`/friends/following/${id}`);

const unfollowFriend = (id: number) =>
	apiClient.post(`/friends/unfollowing/${id}`);

export const useToggleFollow = (searchValue: string) => {
	const queryClient = useQueryClient();

	return useMutation<Friend, unknown, Friend>({
		mutationFn: async (friend) => {
			if (friend.isFollowing) {
				await unfollowFriend(friend.userId);
				return { ...friend, isFollowing: false };
			} else {
				await followFriend(friend.userId);
				return { ...friend, isFollowing: true };
			}
		},
		onMutate: (friend) => {
			queryClient.setQueryData<{
				pages: { contents: Friend[]; hasNextPage: boolean }[];
			}>(["friendlist", searchValue], (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					pages: oldData.pages.map((page) => ({
						...page,
						contents: page.contents.map((f) =>
							f.userId === friend.userId
								? { ...f, isFollowing: !friend.isFollowing }
								: f,
						),
					})),
				};
			});
		},
		onError: (err: unknown) => {
			console.error("❌ API 호출 실패:", err);
			queryClient.invalidateQueries({ queryKey: ["friendlist", searchValue] });
		},
	});
};
