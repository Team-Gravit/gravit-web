export const learningKeys = {
	all: ["learning"] as const,

	chapters: {
		all: () => [...learningKeys.all, "chapters"] as const,
		list: () => [...learningKeys.chapters.all(), "list"] as const,
		detail: (chapterId: number) =>
			[...learningKeys.chapters.all(), chapterId] as const,
	},

	units: {
		all: () => [...learningKeys.all, "units"] as const,
		list: (chapterId: number) =>
			[...learningKeys.units.all(), chapterId] as const,
		lessons: (unitId: number) =>
			[...learningKeys.units.all(), unitId, "lessons"] as const,
		bookmarks: (unitId: number) =>
			[...learningKeys.units.all(), unitId, "bookmarks"] as const,
		wrongAnswers: (unitId: number) =>
			[...learningKeys.units.all(), unitId, "wrong-answers"] as const,
		csNote: (unitId: number) =>
			[...learningKeys.units.all(), unitId, "csNote"] as const,
	},

	lessons: {
		all: () => [...learningKeys.all, "lessons"] as const,
		problems: (lessonId: number) =>
			[...learningKeys.lessons.all(), lessonId, "problems"] as const,
	},
} as const;
