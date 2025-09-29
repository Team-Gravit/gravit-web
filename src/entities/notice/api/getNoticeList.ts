import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { NoticeList } from "@/entities/notice/model/types";

const getNoticeList = async (page: number): Promise<NoticeList> => {
	const response = await apiClient.get<NoticeList>(`/notice/summaries/${page}`);
	console.log(response.data);
	return response.data;
};

export const useNoticeList = (page: number) => {
	return useQuery<NoticeList, AxiosError>({
		queryKey: ["noticelist", page],
		queryFn: () => getNoticeList(page),
		staleTime: 1000 * 60,
		retry: 1,
	});
};
