import {
	type ChangeEvent,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import SubjectiveInput from "./SubjectiveInput";

export interface SubjectiveSolverHandle {
	getAnswer: () => {
		answer: string;
		isCorrect: boolean;
	};
	hasAnswer: () => boolean;
}

export default forwardRef<
	SubjectiveSolverHandle,
	{
		answers: string[];
		enteredAnswer?: string;
		setEnteredAnswer?: (value: string) => void;
	}
>(function SubjectiveSolver(
	{ answers, enteredAnswer = "", setEnteredAnswer },
	ref,
) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChangeAnswer = (e: ChangeEvent<HTMLInputElement>) => {
		const newAnswer = e.target.value;
		setEnteredAnswer?.(newAnswer);
	};

	// 부모 컴포넌트에서 답을 꺼낼 수 있도록 노출
	useImperativeHandle(ref, () => ({
		getAnswer: () => ({
			answer: enteredAnswer,
			isCorrect: answers
				.map((answer) => answer.toLowerCase())
				.includes(enteredAnswer.trim().toLowerCase()),
		}),
		hasAnswer: () => enteredAnswer.trim().length > 0,
	}));

	useEffect(() => {
		const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Enter") {
				// 여기서는 버튼 트리거 없음 - 부모에서 직접 호출
			}
		};

		document.addEventListener("keydown", handleGlobalKeyDown);
		inputRef.current?.focus();

		return () => {
			document.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, []);

	return (
		<section className="flex flex-col w-full">
			<SubjectiveInput
				enteredAnswer={enteredAnswer}
				onChange={handleChangeAnswer}
				ref={inputRef}
			/>
		</section>
	);
});
