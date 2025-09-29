import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { UserInfo } from "@/entities/sidebar/model/types";

const getUserInfo = async (): Promise<UserInfo> => {
	const response = await apiClient.get<UserInfo>("/users/my-page");
	return response.data;
};

export const useUserInfo = () => {
	return useQuery<UserInfo, AxiosError>({
		queryKey: ["userinfo"],
		queryFn: getUserInfo,
		staleTime: 1000 * 60,
		retry: 1,
	});
};
