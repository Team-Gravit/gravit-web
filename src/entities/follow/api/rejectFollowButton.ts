import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const rejectfollowUser = async (id: number): Promise<void> => {
	await api.friend.rejectFollowing(id);
};

export const useRejectFollow = () => {
	return useMutation<void, unknown, number>({
		mutationFn: rejectfollowUser,
	});
};
