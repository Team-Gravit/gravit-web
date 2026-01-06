export interface Chapter {
	chapterId: number;
	title: string;
	description: string;
	progressRate: number;
}

export type ChapterSummary = Omit<Chapter, "progressRate">;

export interface Unit {
	unitId: number;
	title: string;
	description: string;
	progressRate: number;
}

export interface UnitDetail {
	chapterSummary: ChapterSummary;
	unit: Unit;
}

export interface LessonProgressSummary {
	lessonId: number;
	name: string;
	isCompleted: boolean;
}

export interface ChapterWithUnits {
	chapterInfo: ChapterInfo;
	units: Unit[];
}

export interface Lesson {
	lessonId: number;
	title: string;
	totalProblem: number;
	isSolved: boolean;
}

export interface ChapterWithLessons {
	unitInfo: { unitId: number; unitName: string; unitDescription: string };
	hasBookmarkedProblems: boolean;
	hasIncorrectProblems: boolean;
	lessons: Lesson[];
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

export interface UnitSummaryInfo {
	unitId: number;
	title: string;
	description: string;
}

export interface Option {
	optionId: number;
	content: string;
	explanation: string;
	isAnswer: boolean;
	problemId: number;
}

export interface Answer {
	content: string[];
	explanation: string;
}

export interface Problem {
	problemId: number;
	problemType: "SUBJECTIVE" | "OBJECTIVE";
	question: string;
	content: string;
	answer: Answer;
	options: Option[];
	isBookmarked: boolean;
}

export interface ProblemsWithUnitSummary {
	unitSummary: UnitSummaryInfo;
	problems: Problem[];
	totalProblems: number; // 필수!
}
