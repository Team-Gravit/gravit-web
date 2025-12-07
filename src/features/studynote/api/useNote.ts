import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useNote = (chapter: string, unit: string) => {
	return useQuery<string>({
		queryKey: ["note", chapter, unit],
		queryFn: async () => {
			const res = await api.note.getNote(chapter, unit, {
				responseType: "text",
			});

			return res.data as unknown as string;
		},
		staleTime: 1000 * 60,
		retry: 1,
		enabled: !!chapter && !!unit,
	});
};
