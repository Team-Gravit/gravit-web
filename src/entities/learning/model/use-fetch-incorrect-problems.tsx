import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { mapToProblemsWithUnitSummary } from "./mappers";
import { learningKeys } from "../api/query-keys";

export const useFetchIncorrectProblems = (unitId: number) => {
	const query = useQuery({
		queryKey: learningKeys.units.wrongAnswers(unitId),
		queryFn: async () => {
			const response =
				await api.private.wrongAnsweredNote.getAllWrongAnsweredProblemInUnit(
					unitId,
				);

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
