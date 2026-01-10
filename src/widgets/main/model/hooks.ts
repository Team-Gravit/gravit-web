import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { learningKeys } from "@/entities/learning/api/query-keys";

export const useFetchMainInfo = () => {
	const query = useQuery({
		queryKey: ["main-info", learningKeys.all],
		queryFn: () => api.private.user.getMainPage(),
	});

	return { ...query, data: query.data?.data };
};
