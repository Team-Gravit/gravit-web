import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { LeagueInfo } from "@/entities/league/model/types";

const getLeagueInfo = async (leagueId: number): Promise<LeagueInfo> => {
	const response = await apiClient.get<LeagueInfo>(`/league/${leagueId}`);
	console.log(response.data);
	return response.data;
};

export const useLeagueInfo = (leagueId: number) => {
	return useQuery<LeagueInfo, AxiosError>({
		queryKey: ["league-info", leagueId],
		queryFn: () => getLeagueInfo(leagueId),
		staleTime: 1000 * 60,
		retry: 1,
	});
};
