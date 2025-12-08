import AbortIcon from "./assets/x.svg?react";
import TimerIcon from "./assets/timer.svg?react";
import { useEffect, useRef } from "react";
import formatTime from "./lib/formatTime";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import { useIsAnyModalOpen } from "@/features/quiz/model/use-lesson-modal-store";

export default function QuizHeader({
	onHandleQuit,
	learningTitle,
}: {
	onHandleQuit: () => void;
	learningTitle: string;
}) {
	const timeElapsed = useQuizSessionState((state) => state.timeElapsed);
	const incrementTime = useQuizSessionState((state) => state.incrementTime);
	const isPaused = useQuizSessionState((state) => state.isPaused);

	const isAnyModalOpen = useIsAnyModalOpen();

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// 모달이 열려있거나 퀴즈가 일시정지된 경우 타이머 중지
		if (isPaused || isAnyModalOpen) {
			if (timerRef.current !== null) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			return;
		}

		// 타이머 시작
		timerRef.current = setInterval(incrementTime, 1000);
		return () => {
			if (timerRef.current !== null) {
				clearInterval(timerRef.current);
			}
		};
	}, [incrementTime, isPaused, isAnyModalOpen]);

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
