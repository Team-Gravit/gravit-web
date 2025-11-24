import { useQuery } from "@tanstack/react-query";
import { mainPageApi } from "../api/api";

export const useFetchMainInfo = () => {
	const query = useQuery({
		queryKey: ["learning", "main-info"],
		queryFn: () => mainPageApi.getMainInfo(),
	});

	return query;
};
