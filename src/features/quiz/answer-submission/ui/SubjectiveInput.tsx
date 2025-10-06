import type { ChangeEvent, Ref } from "react";

export default function SubjectiveInput({
	enteredAnswer,
	onChange,
	ref,
}: {
	enteredAnswer: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	ref: Ref<HTMLInputElement>;
}) {
	return (
		<input
			ref={ref}
			value={enteredAnswer}
			onChange={onChange}
			className="w-full max-w-[1188px] h-[73px] bg-white rounded-lg border-2 border-black/10 pl-6 text-gray-600 text-2xl font-medium focus:outline-none focus:border-gray-400 "
			placeholder="정답을 입력해주세요."
		/>
	);
}
