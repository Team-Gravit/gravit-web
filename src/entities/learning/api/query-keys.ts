export const learningKeys = {
	all: ["learning"] as const,

	// 챕터 관련
	chapters: () => [...learningKeys.all, "chapters"] as const,

	// 유닛 관련
	units: () => [...learningKeys.all, "units"] as const,
	unit: (chapterId: number) => [...learningKeys.units(), chapterId] as const,

	// 레슨 관련
	lessons: () => [...learningKeys.all, "lessons"] as const,
	lesson: (unitId: number) => [...learningKeys.lessons(), unitId] as const,
	lessonProblems: (lessonId: number) =>
		[...learningKeys.lessons(), "problems", lessonId] as const,

	// 북마크 관련
	bookmarks: () => [...learningKeys.all, "bookmarks"] as const,
	bookmark: (unitId: number) => [...learningKeys.bookmarks(), unitId] as const,

	// 오답노트 관련
	wrongAnswers: () => [...learningKeys.all, "wrong-answers"] as const,
	wrongAnswer: (unitId: number) =>
		[...learningKeys.wrongAnswers(), unitId] as const,
} as const;
