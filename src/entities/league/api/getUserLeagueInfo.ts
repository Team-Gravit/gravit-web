import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config.ts";
import type { AxiosError } from "axios";
import type { UserLeagueInfo } from "@/entities/league/model/types";

export const getUserLeagueInfo = async (): Promise<UserLeagueInfo> => {
	const response = await apiClient.get<UserLeagueInfo>("/ranking/me");
	return response.data;
};

export const useLeagueInfo = () => {
	return useQuery<UserLeagueInfo, AxiosError>({
		queryKey: ["league-info"],
		queryFn: getUserLeagueInfo,
		staleTime: 1000 * 60,
		retry: 1,
	});
};
