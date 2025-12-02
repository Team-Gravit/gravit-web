export const learningKeys = {
	all: ["learning"] as const,

	chapters: () => [...learningKeys.all, "chapters"] as const,

	chapterUnits: (chapterId: number) =>
		[...learningKeys.all, "chapters", chapterId, "units"] as const,

	unitLessons: (unitId: number) =>
		[...learningKeys.all, "units", unitId, "lessons"] as const,

	lessonProblems: (lessonId: number) =>
		[...learningKeys.all, "lessons", lessonId, "problems"] as const,

	unitBookmarks: (unitId: number) =>
		[...learningKeys.all, "units", unitId, "bookmarks"] as const,

	unitWrongAnswers: (unitId: number) =>
		[...learningKeys.all, "units", unitId, "wrong-answers"] as const,
} as const;
