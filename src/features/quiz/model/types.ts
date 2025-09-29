export interface UserAnswer {
	problemId: number;
	userInput: string | number;
	problemType: "SUBJECTIVE" | "OBJECTIVE";
	isCorrect: boolean;
	incorrectCounts: number;
}
