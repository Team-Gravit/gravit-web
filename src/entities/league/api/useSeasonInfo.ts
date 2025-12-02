import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/index";
import type { LeagueHomeResponse } from "@/shared/api/@generated";

export const useSeasonInfo = () => {
	return useQuery<LeagueHomeResponse>({
		queryKey: ["season-info"],
		queryFn: async () => {
			const res = await api.league.enterHome();
			return res.data;
		},
		staleTime: 1000 * 60,
	});
};
