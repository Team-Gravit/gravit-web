import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import {
	mapToChapters,
	mapToChapterWithLessons,
	mapToChapterWithUnits,
	mapToProblemsWithUnitSummary,
} from "./mappers";
import { learningKeys } from "../api/query-keys";

export const useFetchProblems = (lessonId: number) => {
	const query = useQuery({
		queryKey: learningKeys.lessonProblems(lessonId),
		queryFn: async () => {
			const response = await api.learning.getAllProblemsInLesson(lessonId);

			return mapToProblemsWithUnitSummary(response.data);
		},
		enabled: !!lessonId,
	});

	return {
		...query,
		problems: query.data?.problems || [],
		totalProblems: query.data?.totalProblems || 0,
		unitSummary: query.data?.unitSummary,
	};
};

export const useFetchChapters = () => {
	const query = useQuery({
		queryKey: ["chapters"],
		queryFn: async () => {
			const response = await api.learning.getAllChapters();
			return mapToChapters(response.data);
		},
		select: (data) => ({
			chapters: data,
		}),
	});

	return {
		...query,
		chapters: query.data?.chapters || [],
	};
};

export const useFetchChapterWithUnits = (chapterId: number) => {
	const query = useQuery({
		queryKey: ["chapterWithUnits", chapterId],
		queryFn: async () => {
			const response = await api.learning.getAllUnitsInChapter(chapterId);
			return mapToChapterWithUnits(response.data);
		},
	});

	return {
		isPending: query.isPending,
		isError: query.isError,
		error: query.error,
		chapterInfo: query.data?.chapterInfo,
		units: query.data?.units,
	};
};

export const useFetchLessons = (unitId: number) => {
	const query = useQuery({
		queryKey: learningKeys.unitLessons(unitId),
		queryFn: async () => {
			const response = await api.learning.getAllLessonsInUnit(unitId);
			return mapToChapterWithLessons(response.data);
		},
		refetchOnMount: "always",
	});

	return {
		...query,
		isPending: query.isPending,
		isError: query.isError,
		error: query.error,
		chapterInfo: query.data?.chapterInfo,
		lessons: query.data?.lessons,
	};
};
