import type { Problem } from "@/entities/learning/model/types";

export interface ProblemListResponseDTO {
	problems: Problem[];
}

// export interface LearningResultRequestDTO {
// 	chapterId: number;
// 	unitId: number;
// 	lessonId: number;
// 	learningTime: number;
// 	accuracy: number;
// 	problemResults: ProblemResult[];
// }

export interface LearningResultResponseDTO {
	success: boolean;
	userLevel?: number;
	experienceGained?: number;
	message?: string;
}

export interface SubmitReportRequestDTO {
	reportType: "TYPO_ERROR" | "CONTENT_ERROR" | "ANSWER_ERROR" | "OTHER_ERROR";
	content: string;
	problemId: number;
}

export interface SubmitResultRequestDTO {
	lessonId: number;
	learningTime: number;
	accuracy: number;
	problemResults: {
		problemId: number;
		isCorrect: boolean;
		incorrectCounts: number;
	}[];
}

export interface SubmitResultResponseDTO {
	leagueName: string;
	currentLevel: number;
	xp: number;
}
