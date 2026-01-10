import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Friend } from "@/entities/friends/model/types";
import type { UserInfo } from "@/entities/sidebar/model/types";
import { api } from "@/shared/api";

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
			queryClient.setQueryData<{
				pages: { contents: Friend[]; hasNextPage: boolean }[];
			}>(["friend-list", searchValue], (oldData) => {
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

			queryClient.setQueryData<UserInfo>(["user-info"], (oldData) => {
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

			queryClient.invalidateQueries({ queryKey: ["friend-list", searchValue] });
			queryClient.invalidateQueries({ queryKey: ["user-info"] });
		},
	});
};
