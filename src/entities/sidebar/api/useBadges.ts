import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/index";
import { mapToUserBadges } from "@/entities/sidebar/model/mappers";
import type { UserBadges } from "@/entities/sidebar/model/types";

export const useBadges = () => {
	return useQuery<UserBadges>({
		queryKey: ["user-badges"],
		queryFn: async () => {
			const res = await api.private.badge.getAllMyBadges();
			return mapToUserBadges(res.data);
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
