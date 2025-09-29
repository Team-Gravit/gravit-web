import AbortIcon from "./assets/x.svg?react";
import TimerIcon from "./assets/timer.svg?react";
import { useQuizStateStore } from "@/features/quiz/model/store";
import { useEffect, useRef } from "react";
import formatTime from "./lib/formatTime";

export default function QuizHeader({
	lessonName,
	onHandleQuit,
}: {
	lessonName: string;
	onHandleQuit: () => void;
}) {
	const timeElapsed = useQuizStateStore((state) => state.timeElapsed);
	const incrementTime = useQuizStateStore((state) => state.incrementTime);

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
		<header className="h-[84px] flex flex-row items-center bg-white justify-between px-10">
			<button type="button" className="cursor-pointer" onClick={onHandleQuit}>
				<AbortIcon />
			</button>
			<h1 className="text-2xl font-semibold text-neutral-100">{lessonName}</h1>
			<div className="flex flex-row items-center justify-between gap-2 w-[100px]">
				<TimerIcon className="w-5 h-5" />
				<p className="min-w-[70px] text-2xl font-semibold text-gray-800 text-start">
					{formatTime(timeElapsed)}
				</p>
			</div>
		</header>
	);
}
