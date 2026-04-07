import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { userKeys } from "@/entities/user/api/queryKey";

export const useFetchMainInfo = () => {
	const query = useQuery({
		queryKey: userKeys.mainPage(),
		queryFn: () => api.private.user.getMainPage(),
	});

	return { ...query, data: query.data?.data };
};
