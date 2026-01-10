import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { MyLeagueRankWithProfileResponse } from "@/shared/api/@generated";

export const useUserLeagueProfile = () => {
	return useQuery<MyLeagueRankWithProfileResponse>({
		queryKey: ["user-league-profile"],
		queryFn: async () => {
			const res = await api.private.myLeagueProfile.getMyLeagueWithProfile();
			return res.data;
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
