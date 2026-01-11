import { create } from "zustand";
import type { UserAnswer } from "./types";
import { useQuizContext } from "./use-quiz-context";
import type { LearningSubmissionSaveResponse } from "@/shared/api/@generated";

export type QuizMode = "LESSON" | "BOOKMARK" | "INCORRECT";
export type SubmitStrategy = "BATCH" | "STREAM";

interface QuizSession {
	mode: QuizMode;
	submitStrategy: SubmitStrategy;
	currentProblemIndex: number;
	userAnswers: UserAnswer[];
	timeElapsed: number;
	isQuizCompleted: boolean;
	isPaused: boolean;
	isSubmittingResult: boolean;
	submitResponse: LearningSubmissionSaveResponse | null;

	lessonId?: number;
	unitId?: number;

	saveUserAnswer: (
		answer: string | number,
		isCorrect: boolean,
		problemId: number,
		problemType: "SUBJECTIVE" | "OBJECTIVE",
	) => void;
	goToNextProblem: () => void;
	completeQuiz: () => void;
	resetQuiz: () => void;
	saveSubmitResponse: (response: LearningSubmissionSaveResponse) => void;

	incrementTime: () => void;
	pauseTime: () => void;
	resumeTime: () => void;
	resetTime: () => void;
	submitResults: (submitFn: () => Promise<void>) => Promise<void>;
}

// 저장소를 생성하는 팩토리 함수
export function createQuizSessionState(
	mode: QuizMode,
	submitStrategy: SubmitStrategy,
	lessonId?: number,
	unitId?: number,
) {
	return create<QuizSession>((set) => ({
		mode,
		submitStrategy,
		currentProblemIndex: 0,
		userAnswers: [],
		timeElapsed: 0,
		isQuizCompleted: false,
		isSubmittingResult: false,
		submitResponse: null,

		/** 퀴즈의 레슨 / 유닛 아이디 */
		lessonId: lessonId ? Number(lessonId) : undefined,
		unitId: unitId ? Number(unitId) : undefined,

		/** 액션 */
		saveUserAnswer: (
			answer: string | number,
			isCorrect: boolean,
			problemId: number,
			problemType: "SUBJECTIVE" | "OBJECTIVE",
		) =>
			set((state) => {
				const newAnswer: UserAnswer = {
					problemId: problemId,
					problemType: problemType,
					userInput: answer,
					isCorrect: isCorrect,
					incorrectCounts: 0,
				};

				const newAnswers = [...state.userAnswers, newAnswer];

				return { ...state, userAnswers: newAnswers };
			}),
		goToNextProblem: () => {
			set((state) => {
				return {
					...state,
					currentProblemIndex: state.currentProblemIndex + 1,
				};
			});
		},

		completeQuiz: () => {
			set((state) => ({
				...state,
				isQuizCompleted: true,
				isPaused: true,
			}));
		},

		saveSubmitResponse: (response: LearningSubmissionSaveResponse) => {
			set((state) => ({ ...state, submitResponse: response }));
		},

		incrementTime: () => {
			set((state) => {
				if (state.isPaused) return state;
				return { ...state, timeElapsed: state.timeElapsed + 1 };
			});
		},
		resetQuiz: () =>
			set({
				currentProblemIndex: 0,
				userAnswers: [],
				timeElapsed: 0,
				isQuizCompleted: false,
				isPaused: false,
				submitResponse: null,
			}),
		pauseTime: () => {
			set((state) => {
				if (state.isPaused) return state;
				return { ...state, isPaused: true };
			});
		},
		resumeTime: () => {
			set((state) => {
				if (!state.isPaused) return state;
				return { ...state, isPaused: false };
			});
		},
		resetTime: () => {
			set((state) => {
				return { ...state, isPaused: false, timeElapsed: 0 };
			});
		},

		submitResults: async (submitFn: () => Promise<void>) => {
			set((state) => ({ ...state, isSubmittingResult: true }));
			try {
				await submitFn();
			} finally {
				set((state) => ({ ...state, isSubmittingResult: false }));
			}
		},

		isQuizSubmitted: false,
		isPaused: false,
	}));
}

export function useQuizSessionState<T>(selector: (state: QuizSession) => T): T {
	const { store } = useQuizContext();
	return store(selector);
}

export function useQuizSessionActions() {
	const { store } = useQuizContext();
	return store((state) => ({
		submitAnswer: state.saveUserAnswer,
		goToNextProblem: state.goToNextProblem,
		completeQuiz: state.completeQuiz,
		resetQuiz: state.resetQuiz,
		pauseTime: state.pauseTime,
		resumeTime: state.resumeTime,
		resetTime: state.resetTime,
		submitResults: state.submitResults,
	}));
}
