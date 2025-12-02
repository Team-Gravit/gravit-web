import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { AxiosError } from "axios";
import type { NoticeList } from "@/entities/notice/model/types";
import { mapToNoticeList } from "@/entities/notice/model/mappers";
import type { SliceResponse } from "@/shared/api/@generated";
export const useNoticeList = (page: number) => {
	return useQuery<NoticeList, AxiosError>({
		queryKey: ["notice-list", page],
		queryFn: async () => {
			const res = await api.notice.getNoticeSummaries(page);
			const data = res.data as SliceResponse;

			const totalPages = 1;

			return mapToNoticeList(data, page, totalPages);
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
