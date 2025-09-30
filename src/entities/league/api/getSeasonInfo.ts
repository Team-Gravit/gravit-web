import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config.ts";
import type { AxiosError } from "axios";
import type { SeasonInfo } from "@/entities/league/model/types";

export const getSeasonInfo = async (): Promise<SeasonInfo> => {
	const response = await apiClient.get<SeasonInfo>("/league/home");
	return response.data;
};

export const useSeasonInfo = () => {
	return useQuery<SeasonInfo, AxiosError>({
		queryKey: ["season-info"],
		queryFn: getSeasonInfo,
		staleTime: 1000 * 60,
		retry: 1,
	});
};
