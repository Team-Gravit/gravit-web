import { useQuery } from "@tanstack/react-query";
import type { LeagueHomeResponse } from "@/shared/api/@generated";
import { api } from "@/shared/api/index";

export const useSeasonInfo = () => {
	return useQuery<LeagueHomeResponse>({
		queryKey: ["season-info"],
		queryFn: async () => {
			const res = await api.private.league.enterHome();
			return res.data;
		},
		staleTime: 1000 * 60,
	});
};
