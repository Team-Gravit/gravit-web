import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useFetchMainInfo = () => {
	const query = useQuery({
		queryKey: ["main-info"],
		queryFn: () => api.user.manage.getMainPage(),
	});

	return { ...query, data: query.data?.data };
};
