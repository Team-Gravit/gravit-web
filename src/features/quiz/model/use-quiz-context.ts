import { useContext } from "react";
import QuizStoreContext from "./quiz-store-context";

export const useQuizContext = () => {
	const context = useContext(QuizStoreContext);
	if (!context) {
		throw new Error(
			"useQuizContext는 <QuizProvider> 안에서만 사용 가능합니다.",
		);
	}
	return context;
};
