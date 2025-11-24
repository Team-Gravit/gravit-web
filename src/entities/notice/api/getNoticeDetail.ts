import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { NoticeDetail } from "@/entities/notice/model/types";

const getNoticeDetail = async (noticeId: number): Promise<NoticeDetail> => {
	const response = await apiClient.get<NoticeDetail>(`/notice/${noticeId}`);
	return response.data;
};

export const useNoticeDetail = (noticeId: number) => {
	return useQuery<NoticeDetail, AxiosError>({
		queryKey: ["noticedetail", noticeId],
		queryFn: () => getNoticeDetail(noticeId),
		staleTime: 1000 * 60,
		retry: 1,
	});
};
