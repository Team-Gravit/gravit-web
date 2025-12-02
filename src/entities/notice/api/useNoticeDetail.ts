import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { NoticeDetail } from "@/entities/notice/model/types";
import { mapToNoticeDetail } from "@/entities/notice/model/mappers";

export const useNoticeDetail = (noticeId: number) => {
	return useQuery<NoticeDetail>({
		queryKey: ["notice-detail", noticeId],
		queryFn: async () => {
			const res = await api.notice.getNoticeSummary(noticeId);
			return mapToNoticeDetail(res.data);
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
