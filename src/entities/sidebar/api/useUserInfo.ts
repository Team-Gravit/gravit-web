import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { mapToUserInfo } from "@/entities/sidebar/model/mappers";
import type { UserInfo } from "@/entities/sidebar/model/types";

export const useUserInfo = () => {
	return useQuery<UserInfo>({
		queryKey: ["user-info"],
		queryFn: async () => {
			const res = await api.private.user.getMyPage();
			return mapToUserInfo(res.data);
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
