import type {
	AnswerResponse,
	ChapterDetailResponse,
	LessonDetailResponse,
	LessonResponse,
	OptionResponse,
	ProblemResponse,
	UnitDetailResponse,
	UnitSummary,
} from "@/shared/api/@generated";
import type {
	Answer,
	Chapter,
	ChapterWithLessons,
	ChapterWithUnits,
	Lesson,
	Option,
	Problem,
	ProblemsWithUnitSummary,
	Unit,
	UnitSummaryInfo,
} from "./types";

/**
 * ChapterDetailResponse (OpenAPI 타입, 옵셔널 많음)
 *   ↓
 * Chapter (프론트엔드 도메인 타입, 모두 필수)
 */
export function mapToChapter(raw: ChapterDetailResponse): Chapter {
	const { chapterSummary, chapterProgressRate } = raw;

	// 필수 필드 검증
	if (
		!chapterSummary?.chapterId ||
		!chapterSummary?.title ||
		chapterSummary.description === undefined
	) {
		throw new Error("Invalid chapter data: missing required fields");
	}

	return {
		chapterId: chapterSummary.chapterId,
		title: chapterSummary.title,
		description: chapterSummary.description,
		progressRate: chapterProgressRate || 0,
	};
}

export function mapToChapters(raw: ChapterDetailResponse[]): Chapter[] {
	return raw.map(mapToChapter);
}

export function mapToChapterWithUnits(
	raw: UnitDetailResponse,
): ChapterWithUnits {
	const { chapterSummary, unitDetails } = raw;

	// 필수 필드 검증
	if (
		!chapterSummary?.chapterId ||
		!chapterSummary?.title ||
		chapterSummary.description === undefined
	) {
		throw new Error("Invalid chapter data: missing required fields");
	}

	if (!unitDetails || !Array.isArray(unitDetails)) {
		throw new Error("Invalid unit details: missing or invalid array");
	}

	const chapterInfo = {
		chapterId: chapterSummary.chapterId,
		chapterName: chapterSummary.title,
		chapterDescription: chapterSummary.description,
	};

	const units: Unit[] = unitDetails.map((unitDetail) => {
		const { unitSummaries, progressRate } = unitDetail;

		if (
			!unitSummaries?.unitId ||
			!unitSummaries?.title ||
			unitSummaries.description === undefined
		) {
			throw new Error("Invalid unit data: missing required fields");
		}

		return {
			unitId: unitSummaries.unitId,
			title: unitSummaries.title,
			description: unitSummaries.description,
			progressRate: progressRate || 0,
		};
	});

	return {
		chapterInfo,
		units,
	};
}

export function mapToChapterWithLessons(
	raw: LessonDetailResponse,
): ChapterWithLessons {
	const {
		chapterSummary,
		lessonSummaries,
		bookmarkAccessible,
		wrongAnsweredNoteAccessible,
	} = raw;

	// 필수 필드 검증
	if (
		!chapterSummary?.chapterId ||
		!chapterSummary?.title ||
		chapterSummary.description === undefined
	) {
		throw new Error("Invalid chapter data: missing required fields");
	}

	if (!lessonSummaries || !Array.isArray(lessonSummaries)) {
		throw new Error("Invalid unit details: missing or invalid array");
	}

	const chapterInfo = {
		chapterId: chapterSummary.chapterId,
		chapterName: chapterSummary.title,
		chapterDescription: chapterSummary.description,
	};

	const lessons: Lesson[] = lessonSummaries.map((lessonSummary) => {
		const { lessonId, title, totalProblem, isSolved } = lessonSummary;

		if (!lessonId || !title || !totalProblem || isSolved === undefined) {
			throw new Error("Invalid unit data: missing required fields");
		}

		return {
			lessonId,
			title,
			totalProblem,
			isSolved,
		};
	});

	const hasBookmarkedProblems = bookmarkAccessible;
	const hasIncorrectProblems = wrongAnsweredNoteAccessible;

	return {
		chapterInfo,
		hasBookmarkedProblems,
		hasIncorrectProblems,
		lessons,
	};
}

function mapToAnswer(raw: AnswerResponse | undefined): Answer {
	if (!raw?.content || !raw?.explanation) {
		throw new Error("Invalid answer: missing required fields");
	}
	return {
		content: raw.content.split(",").map((s) => s.trim()),
		explanation: raw.explanation,
	};
}

function mapToOption(raw: OptionResponse): Option {
	if (!raw.content || !raw.explanation) {
		throw new Error(
			"Invalid option: missing required fields (content, explanation)",
		);
	}

	return {
		optionId: raw.optionId || 0,
		content: raw.content,
		explanation: raw.explanation,
		isAnswer: raw.isAnswer ?? false,
		problemId: raw.problemId || 0,
	};
}

function mapToProblem(raw: ProblemResponse): Problem {
	if (!raw.instruction || !raw.content) {
		throw new Error(
			"Invalid problem: missing required fields (instruction, content)",
		);
	}

	const isSubjective = raw.problemType === "SUBJECTIVE";

	return {
		problemId: raw.problemId || 0,
		problemType: raw.problemType,
		question: raw.instruction,
		content: raw.content,
		answer: isSubjective
			? mapToAnswer(raw.answerResponse)
			: { content: [], explanation: "" },
		options: raw.options?.map(mapToOption) || [],
		isBookmarked: raw.isBookmarked ?? false,
	};
}

function mapToUnitSummaryInfo(raw: UnitSummary): UnitSummaryInfo {
	if (!raw.title || !raw.description || raw.unitId === undefined) {
		throw new Error("Invalid unit summary: missing required fields");
	}

	return {
		unitId: raw.unitId,
		title: raw.title,
		description: raw.description,
	};
}

export function mapToProblemsWithUnitSummary(
	raw: LessonResponse,
): ProblemsWithUnitSummary {
	if (!raw.unitSummary || !raw.problems || !Array.isArray(raw.problems)) {
		throw new Error("Invalid lesson response: missing required fields");
	}
	return {
		unitSummary: mapToUnitSummaryInfo(raw.unitSummary),
		problems: raw.problems.map(mapToProblem),
		totalProblems: raw.totalProblems || raw.problems.length,
	};
}
