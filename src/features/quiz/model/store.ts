import { create } from "zustand";
import type { UserAnswer } from "./types";
import type { SubmitResultResponseDTO } from "../api/dto";

interface QuizState {
	currentProblemIndex: number;
	userAnswers: UserAnswer[];
	timeElapsed: number;
	isQuizCompleted: boolean;
	isPaused: boolean;
	latestQuizResult:
		| (SubmitResultResponseDTO & { timeElapsed: number; accuracy: number })
		| undefined;

	submitAnswer: (
		answer: string | number,
		isCorrect: boolean,
		problemId: number,
		problemType: "SUBJECTIVE" | "OBJECTIVE",
	) => void;
	goToNextProblem: () => void;
	completeQuiz: () => void;
	saveQuizResult: (
		result: SubmitResultResponseDTO & { accuracy: number },
	) => void;
	incrementTime: () => void;
	resetQuiz: () => void;
	pauseTime: () => void;
	resumeTime: () => void;
	resetTime: () => void;
}

export const useQuizStateStore = create<QuizState>((set) => ({
	/** 상태 */
	currentProblemIndex: 0,
	userAnswers: [],
	timeElapsed: 0,
	isQuizCompleted: false,
	latestQuizResult: undefined,

	/** 액션 */
	submitAnswer: (
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

			console.log(newAnswers, "제출!");

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

	saveQuizResult: (result: SubmitResultResponseDTO & { accuracy: number }) => {
		set((state) => ({
			...state,
			latestQuizResult: {
				...result,
				timeElapsed: state.timeElapsed,
			},
		}));
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
	isQuizSubmitted: false,
	isPaused: false,
}));
