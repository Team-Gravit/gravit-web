import { forwardRef, useImperativeHandle, useRef, type Ref } from "react";
import RabbitIcon from "./mascot-sad.svg?react";

interface LessonQuitModalProps {
	ref: Ref<HTMLDialogElement>;
	onClose: () => void;
	onHandleQuit: () => void;
}

export interface LessonQuitModalRef {
	open: () => void;
	close: () => void;
}

export const LessonQuitModal = forwardRef<
	LessonQuitModalRef,
	LessonQuitModalProps
>(function LessonQuitModal({ onClose, onHandleQuit }, ref) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useImperativeHandle(ref, () => ({
		open() {
			dialogRef.current?.showModal();
		},
		close() {
			dialogRef.current?.close();
		},
	}));

	return (
		<dialog
			ref={dialogRef}
			className="p-0 m-0 border-none bg-transparent max-w-none max-h-none w-auto"
			style={{
				background: "rgba(0, 0, 0, 0.6)",
				width: "100vw",
				height: "100vh",
			}}
			onClose={onClose}
		>
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="bg-white rounded-2xl w-[500px] lg:w-[600px] max-h-[600px] pt-3 pb-6 px-8 flex flex-col items-center gap-1">
					<RabbitIcon width={180} />
					<div className="text-xl font-semibold text-center space-y-1">
						<h3 className="font-semibold">
							지금까지 푼 내역이
							<br />
							모두 사라져요!
						</h3>
					</div>

					<p className="text-lg font-normal text-center space-y-1 text-gray-600 mb-3">
						자료구조 학습 출제가 중단됩니다.
						<br />
						정말 학습을 그만두시나요?
					</p>
					<form method="dialog" className="flex flex-col gap-2">
						<button
							type="submit"
							className="cursor-pointer p-3 bg-main-2 w-[300px] rounded-full text-white text-lg font-semibold "
						>
							계속하기
						</button>
						<button
							type="submit"
							onClick={onHandleQuit}
							className="text-gray-600 text-xl font-semibold hover:text-gray-800 hover:underline transition-all duration-200 focus:outline-none px-2 py-1 cursor-pointer"
						>
							그만두기
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
});
