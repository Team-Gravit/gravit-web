import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { UserBadges } from "@/entities/sidebar/model/types";

const getBadges = async (): Promise<UserBadges> => {
	const response = await apiClient.get<UserBadges>("/badges/me");
	return response.data;
};

export const useBadges = () => {
	return useQuery<UserBadges, AxiosError>({
		queryKey: ["userbadge"],
		queryFn: getBadges,
		staleTime: 1000 * 60,
		retry: 1,
	});
};
