import { useQuery } from "@tanstack/react-query";
import { mapToNoticeDetail } from "@/entities/notice/model/mappers";
import type { NoticeDetail } from "@/entities/notice/model/types";
import { api } from "@/shared/api";

export const useNoticeDetail = (noticeId: number) => {
	return useQuery<NoticeDetail>({
		queryKey: ["notice-detail", noticeId],
		queryFn: async () => {
			const res = await api.private.notice.getNoticeSummary(noticeId);
			return mapToNoticeDetail(res.data);
		},
		staleTime: 1000 * 60,
		retry: 1,
	});
};
