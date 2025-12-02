import { createContext, type ReactNode, useMemo } from "react";
import {
	createQuizSessionState,
	type QuizMode,
	type SubmitStrategy,
} from "./quiz-session-store";

interface QuizContextType {
	mode: QuizMode;
	strategy: SubmitStrategy;
	store: ReturnType<typeof createQuizSessionState>;
	lessonId?: number;
	unitId?: number;
}

const QuizStoreContext = createContext<QuizContextType | null>(null);

export const QuizStoreProvider = ({
	children,
	mode,
	strategy,
	lessonId,
	unitId,
}: {
	children: ReactNode;
	mode: QuizMode;
	strategy: SubmitStrategy;
	lessonId?: number;
	unitId?: number;
}) => {
	const store = useMemo(
		() => createQuizSessionState(mode, strategy, lessonId, unitId),
		[mode, strategy, lessonId, unitId],
	);

	return (
		<QuizStoreContext.Provider
			value={{ mode, strategy, lessonId, unitId, store }}
		>
			{children}
		</QuizStoreContext.Provider>
	);
};

export default QuizStoreContext;
