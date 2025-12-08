import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { NoticeList, NoticeItem } from "@/entities/notice/model/types";
import { mapToNoticeList } from "@/entities/notice/model/mappers";
import type { SliceResponse } from "@/shared/api/@generated";

export const useNoticeList = (page: number) => {
	return useQuery<NoticeList>({
		queryKey: ["notice-list", page],
		queryFn: async () => {
			const res = await api.notice.getNoticeSummaries(page);
			const data = res.data as SliceResponse & { totalPages?: number };

			if (!data.contents) {
				throw new Error("Invalid SliceResponse format");
			}

			const notices: NoticeItem[] = data.contents as NoticeItem[];

			const totalPages = data.totalPages ?? 1;

			return mapToNoticeList(data, page, totalPages, notices);
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
