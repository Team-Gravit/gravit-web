import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { mapToProblemsWithUnitSummary } from "./mappers";
import { learningKeys } from "../api/query-keys";

export const useFetchBookmarkedProblems = (unitId: number) => {
	const query = useQuery({
		queryKey: learningKeys.units.bookmarks(unitId),
		queryFn: async () => {
			const response =
				await api.private.bookmark.getAllBookmarkedProblemInUnit(unitId);

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
