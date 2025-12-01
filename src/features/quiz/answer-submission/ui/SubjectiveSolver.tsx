import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useQuizStateStore } from "../../model/store";
import FloatingButton from "./FloatingButton";
import SubjectiveInput from "./SubjectiveInput";
import CheckIcon from "./assets/floating-check.svg?react";

export default function SubjectiveSolver({
	answers,
	problemId,
}: {
	answers: string[];
	problemId: number;
}) {
	const { submitAnswer } = useQuizStateStore();
	const [enteredAnswer, setEnteredAnswer] = useState("");
	const buttonRef = useRef<HTMLButtonElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChangeAnswer = (e: ChangeEvent<HTMLInputElement>) => {
		setEnteredAnswer(e.target.value);
	};

	useEffect(() => {
		const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Enter") {
				buttonRef.current?.click();
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
			<FloatingButton
				ref={buttonRef}
				onHandleClick={() =>
					submitAnswer(
						enteredAnswer,
						answers.includes(enteredAnswer.trim()),
						problemId,
						"SUBJECTIVE",
					)
				}
			>
				<CheckIcon className="w-[45px] lg:w-[74px]" />
			</FloatingButton>
		</section>
	);
}
