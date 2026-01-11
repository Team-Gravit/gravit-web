import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { learningKeys } from "../api/query-keys";
import { mapToProblemsWithUnitSummary } from "./mappers";

export const useFetchBookmarkedProblems = (unitId: number) => {
	const query = useQuery({
		queryKey: learningKeys.unitBookmarks(unitId),
		queryFn: async () => {
			const response =
				await api.private.learning.getBookmarkedProblemsInUnit(unitId);

			return mapToProblemsWithUnitSummary(response.data);
		},
		refetchOnMount: "always",
		enabled: !!unitId,
	});

	return {
		...query,
		problems: query.data?.problems || [],
		totalProblems: query.data?.totalProblems || 0,
		unitSummary: query.data?.unitSummary,
	};
};
