import { useQuery } from "@tanstack/react-query";
import { learningApi } from "../api/api";
import { api } from "@/shared/api";
import {
	mapToChapters,
	mapToChapterWithLessons,
	mapToChapterWithUnits,
} from "./mappers";

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

/** 마이그레이션 완료 */
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
			// API 응답을 프론트엔드 타입으로 변환
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
		queryKey: ["unitId", unitId],
		queryFn: async () => {
			const response = await api.learning.getAllLessonsInUnit(unitId);
			// API 응답을 프론트엔드 타입으로 변환
			return mapToChapterWithLessons(response.data);
		},
	});

	return {
		isPending: query.isPending,
		isError: query.isError,
		error: query.error,
		chapterInfo: query.data?.chapterInfo,
		lessons: query.data?.lessons,
	};
};
