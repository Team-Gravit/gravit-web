import { useQuizContext } from "./use-quiz-context";

export const useQuizStore = () => {
	const { store } = useQuizContext();
	return store();
};
