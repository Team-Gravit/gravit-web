import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useNote = (unitId: number) => {
	return useQuery<string>({
		queryKey: ["cs-note", unitId],
		queryFn: async () => {
			const res = await api.note.getNote(unitId, {
				responseType: "text",
			});

			console.log(res.data);
			return res.data as unknown as string;
		},
		staleTime: 1000 * 60,
		retry: 1,
		enabled: !!unitId,
	});
};
