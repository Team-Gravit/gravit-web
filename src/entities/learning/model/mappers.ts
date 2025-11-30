import type {
	ChapterDetailResponse,
	LessonDetailResponse,
	UnitDetailResponse,
} from "@/shared/api/@generated";
import type {
	Chapter,
	ChapterWithLessons,
	ChapterWithUnits,
	Lesson,
	Unit,
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
	const { chapterSummary, lessonSummaries } = raw;

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

	return { chapterInfo, lessons };
}
