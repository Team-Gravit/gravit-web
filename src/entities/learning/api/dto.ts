import type { Problem, UnitDetail } from "../model/types";

export type ChapterDetailResponseDTO = {
	chapterId: number;
	chapterName: string;
	chapterDescription: string;
	unitDetails: UnitDetail[];
};

export interface ProblemListResponseDTO {
	chapterId: number;
	lessonName: string;
	problems: Problem[];
	totalProblems: number;
}
