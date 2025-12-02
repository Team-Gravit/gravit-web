import AbortIcon from "./assets/x.svg?react";
import TimerIcon from "./assets/timer.svg?react";
import { useEffect, useRef } from "react";
import formatTime from "./lib/formatTime";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";

export default function QuizHeader({
	learningTitle,
	onHandleQuit,
}: {
	learningTitle: string;
	onHandleQuit: () => void;
}) {
	const timeElapsed = useQuizSessionState((state) => state.timeElapsed);
	const incrementTime = useQuizSessionState((state) => state.incrementTime);

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		timerRef.current = setInterval(incrementTime, 1000);
		return () => {
			if (timerRef.current !== null) {
				clearInterval(timerRef.current);
			}
		};
	}, [incrementTime]);

	return (
		<header className="relative flex flex-row items-center bg-white justify-between px-5 py-7">
			<button type="button" className="cursor-pointer" onClick={onHandleQuit}>
				<AbortIcon className="w-6 h-6" />
			</button>
			<h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-neutral-100">
				{learningTitle}
			</h2>
			<div className="flex flex-row items-center justify-between gap-2 w-[100px]">
				<TimerIcon className="w-5 h-5" />
				<p className="min-w-[70px] text-2xl font-semibold text-gray-800 text-start">
					{formatTime(timeElapsed)}
				</p>
			</div>
		</header>
	);
}
