import { useQuery } from "@tanstack/react-query";
import { learningApi } from "../api/api";

export const useFetchProblems = (lessonId: number) => {
	const query = useQuery({
		queryKey: ["problems", lessonId],
		queryFn: () => learningApi.getProblems(lessonId),
		select: (data) => ({
			chapterId: data.chapterId,
			problems: data.problems,
			totalCount: data.problems.length,
			lessonName: data.lessonName,
		}),
		enabled: !!lessonId,
	});

	return {
		...query,
		problems: query.data?.problems || [],
		totalCount: query.data?.totalCount || 0,
		lessonName: query.data?.lessonName,
		chapterId: query.data?.chapterId,
	};
};

export const useFetchChapters = () => {
	const query = useQuery({
		queryKey: ["learning", "chapters"],
		queryFn: () => learningApi.getChapterList(),
		select: (data) => ({
			chapters: data,
		}),
	});

	return {
		...query,
		chapters: query.data?.chapters || [],
	};
};

export const useFetchUnits = (chapterId: number) => {
	const query = useQuery({
		queryKey: ["learning", "units", chapterId],
		queryFn: () => learningApi.getUnitList(chapterId),
	});

	const chapterInfo = query.data
		? {
				id: query.data.chapterId,
				name: query.data.chapterName,
				description: query.data.chapterDescription,
			}
		: undefined;

	const units =
		query.data?.unitDetails.map((detail) => ({
			...detail.unitProgressDetailResponse,
			lessons: detail.lessonProgressSummaryResponses,
		})) || [];

	return {
		...query,
		chapterInfo,
		units,
	};
};
