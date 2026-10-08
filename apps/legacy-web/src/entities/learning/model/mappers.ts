import type {
  AnswerResponse,
  ChapterDetailResponse,
  LessonDetailResponse,
  LessonResponse,
  OptionResponse,
  ProblemResponse,
  UnitPageResponse,
  UnitSummaryResponse,
} from '@/shared/api/@generated';

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
} from './_types';

export function mapToChapter(raw: ChapterDetailResponse): Chapter {
  const { chapterSummaryResponse, chapterProgressRate } = raw;

  if (
    !chapterSummaryResponse?.chapterId ||
    !chapterSummaryResponse?.title ||
    chapterSummaryResponse.description === undefined
  ) {
    throw new Error('Invalid chapter data: missing required fields');
  }

  return {
    chapterId: chapterSummaryResponse.chapterId,
    title: chapterSummaryResponse.title,
    description: chapterSummaryResponse.description,
    progressRate: chapterProgressRate || 0,
  };
}

export function mapToChapters(raw: ChapterDetailResponse[]): Chapter[] {
  return raw.map(mapToChapter);
}

export function mapToChapterWithUnits(raw: UnitPageResponse): ChapterWithUnits {
  const { chapterSummaryResponse, unitDetailResponses } = raw;

  if (
    !chapterSummaryResponse?.chapterId ||
    !chapterSummaryResponse?.title ||
    chapterSummaryResponse.description === undefined
  ) {
    throw new Error('Invalid chapter data: missing required fields');
  }

  if (!unitDetailResponses || !Array.isArray(unitDetailResponses)) {
    throw new Error('Invalid unit details: missing or invalid array');
  }

  const chapterInfo = {
    chapterId: chapterSummaryResponse.chapterId,
    chapterName: chapterSummaryResponse.title,
    chapterDescription: chapterSummaryResponse.description,
  };

  const units: Unit[] = unitDetailResponses.map((unitDetail) => {
    const { unitSummaryResponse, progressRate } = unitDetail;

    if (
      !unitSummaryResponse?.unitId ||
      !unitSummaryResponse?.title ||
      unitSummaryResponse.description === undefined
    ) {
      throw new Error('Invalid unit data: missing required fields');
    }

    return {
      unitId: unitSummaryResponse.unitId,
      title: unitSummaryResponse.title,
      description: unitSummaryResponse.description,
      progressRate: progressRate || 0,
    };
  });

  return { chapterInfo, units };
}

export function mapToChapterWithLessons(raw: LessonDetailResponse): ChapterWithLessons {
  const { unitSummaryResponse, lessonSummaries, bookmarkAccessible, wrongAnsweredNoteAccessible } =
    raw;

  if (
    !unitSummaryResponse?.unitId ||
    !unitSummaryResponse?.title ||
    unitSummaryResponse.description === undefined
  ) {
    throw new Error('Invalid chapter data: missing required fields');
  }

  if (!lessonSummaries || !Array.isArray(lessonSummaries)) {
    throw new Error('Invalid unit details: missing or invalid array');
  }

  const unitInfo = {
    unitId: unitSummaryResponse.unitId,
    unitName: unitSummaryResponse.title,
    unitDescription: unitSummaryResponse.description,
  };

  const lessons: Lesson[] = lessonSummaries.map((lessonSummary) => {
    const { lessonId, title, totalProblem, isSolved } = lessonSummary;

    if (!lessonId || !title || !totalProblem || isSolved === undefined) {
      throw new Error('Invalid unit data: missing required fields');
    }

    return { lessonId, title, totalProblem, isSolved };
  });

  return {
    unitInfo,
    hasBookmarkedProblems: bookmarkAccessible,
    hasIncorrectProblems: wrongAnsweredNoteAccessible,
    lessons,
  };
}

function mapToAnswer(raw: AnswerResponse | undefined): Answer {
  if (!raw?.contents || !raw?.explanation) {
    throw new Error('Invalid answer: missing required fields');
  }
  return { content: raw.contents, explanation: raw.explanation };
}

function mapToOption(raw: OptionResponse): Option {
  if (!raw.content || !raw.explanation) {
    throw new Error('Invalid option: missing required fields (content, explanation)');
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
    throw new Error('Invalid problem: missing required fields (instruction, content)');
  }

  const isSubjective = raw.problemType === 'SUBJECTIVE';

  return {
    problemId: raw.problemId || 0,
    problemType: raw.problemType,
    question: raw.instruction,
    content: raw.content,
    answer: isSubjective ? mapToAnswer(raw.answerResponse) : { content: [], explanation: '' },
    options: raw.options?.map(mapToOption) || [],
    isBookmarked: raw.isBookmarked ?? false,
  };
}

function mapToUnitSummaryInfo(raw: UnitSummaryResponse): UnitSummaryInfo {
  if (!raw.title || !raw.description || raw.unitId === undefined) {
    throw new Error('Invalid unit summary: missing required fields');
  }

  return { unitId: raw.unitId, title: raw.title, description: raw.description };
}

export function mapToProblemsWithUnitSummary(raw: LessonResponse): ProblemsWithUnitSummary {
  if (!raw.unitSummaryResponse || !raw.problems || !Array.isArray(raw.problems)) {
    throw new Error('Invalid lesson response: missing required fields');
  }
  return {
    unitSummary: mapToUnitSummaryInfo(raw.unitSummaryResponse),
    problems: raw.problems.map(mapToProblem),
    totalProblems: raw.totalProblems || raw.problems.length,
  };
}
