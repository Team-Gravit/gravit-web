import SubjectiveInput from "./SubjectiveInput";
import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	forwardRef,
	useImperativeHandle,
} from "react";

export interface SubjectiveSolverHandle {
	getAnswer: () => {
		answer: string;
		isCorrect: boolean;
	};
}

export default forwardRef<
	SubjectiveSolverHandle,
	{
		answers: string[];
	}
>(function SubjectiveSolver({ answers }, ref) {
	const [enteredAnswer, setEnteredAnswer] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChangeAnswer = (e: ChangeEvent<HTMLInputElement>) => {
		setEnteredAnswer(e.target.value);
	};

	// 부모 컴포넌트에서 답을 꺼낼 수 있도록 노출
	useImperativeHandle(ref, () => ({
		getAnswer: () => ({
			answer: enteredAnswer,
			isCorrect: answers.includes(enteredAnswer.trim()),
		}),
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
