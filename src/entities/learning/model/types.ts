export interface Chapter {
	chapterId: number;
	name: string;
	description: string;
	totalUnits: number;
	completedUnits: number;
}

export interface Unit {
	unitId: number;
	name: string;
	totalLesson: number;
	completedLesson: number;
	lessons: Lesson[];
}

export interface UnitDetail {
	unitProgressDetailResponse: UnitProgressDetail;
	lessonProgressSummaryResponses: LessonProgressSummary[];
}

export interface LessonProgressSummary {
	lessonId: number;
	name: string;
	isCompleted: boolean;
}

interface UnitProgressDetail {
	unitId: number;
	name: string;
	totalLesson: number;
	completedLesson: number;
}

export interface UnitInfo {
	chapterInfo: ChapterInfo;
	units: Unit[];
}

export interface ChapterInfo {
	chapterId: number;
	chapterName: string;
	chapterDescription: string;
}

export interface Lesson {
	lessonId: number;
	name: string;
	isCompleted: boolean;
}

export interface Problem {
	problemId: number;
	problemType: "SUBJECTIVE" | "OBJECTIVE";
	question: string;
	content: string;
	answer: string;
	options: Option[];
}

export interface Option {
	optionId: number;
	content: string;
	explanation: string;
	isAnswer: boolean;
	problemId: number;
}

export interface ProblemResult {
	problemId: number;
	isCorrect: boolean;
	incorrectCounts: number;
}
