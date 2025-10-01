import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { Friend } from "@/entities/friends/model/types";
import type { UserInfo } from "@/entities/sidebar/model/types";

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
			// 1. 친구 리스트 즉시 반영
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

			// 2. 사이드바 팔로잉 수 즉시 반영
			queryClient.setQueryData<UserInfo>(["userinfo"], (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					following: friend.isFollowing
						? oldData.following - 1
						: oldData.following + 1,
				};
			});
		},

		onError: (err: unknown) => {
			console.error("❌ API 호출 실패:", err);
			// 실패 시 쿼리 무효화하여 최신 데이터 재요청
			queryClient.invalidateQueries({ queryKey: ["friendlist", searchValue] });
			queryClient.invalidateQueries({ queryKey: ["userinfo"] });
		},
	});
};
