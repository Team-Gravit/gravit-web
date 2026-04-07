import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Friend } from "@/entities/friends/model/types";
import type { UserInfo } from "@/entities/sidebar/model/types";
import { api } from "@/shared/api";
import { userKeys } from "@/entities/user/api/queryKey";

const followFriend = async (id: number): Promise<void> => {
	await api.private.friend.following(id);
};

const unfollowFriend = async (id: number): Promise<void> => {
	await api.private.friend.unFollowing(id);
};

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
			// 친구 검색 결과 낙관적 업데이트
			queryClient.setQueryData<{
				pages: { contents: Friend[]; hasNextPage: boolean }[];
			}>(userKeys.friends.search(searchValue), (oldData) => {
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

			// 사이드바 팔로잉 카운트 낙관적 업데이트
			queryClient.setQueryData<UserInfo>(userKeys.info(), (oldData) => {
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

			// 에러 시 실제 서버 데이터로 재동기화
			queryClient.invalidateQueries({
				queryKey: userKeys.friends.search(searchValue),
			});
			queryClient.invalidateQueries({ queryKey: userKeys.info() });
		},
	});
};
