import { useRouter } from "@tanstack/react-router";
import Modal from "@/widgets/modal/modal";
import { useLessonModalStore } from "../../model/use-lesson-modal-store";
import RabbitIcon from "./assets/mascot-sad.svg?react";

export const LessonQuitModal = () => {
	const { isQuitOpen, closeQuitModal } = useLessonModalStore();
	const router = useRouter();

	const onHandleQuit = () => {
		closeQuitModal();
		router.history.back();
	};
	return (
		<Modal
			isOpen={isQuitOpen}
			onClose={closeQuitModal}
			hasCloseButton={false}
			isBackdropClosable={false}
		>
			<div className="bg-white rounded-2xl w-[500px] md:w-[600px] lg:w-[700px] max-h-[600px] pt-3 pb-6 px-8 flex flex-col items-center gap-1">
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
						type="button"
						onClick={onHandleQuit}
						className="text-gray-600 text-xl font-semibold hover:text-gray-800 hover:underline transition-all duration-200 focus:outline-none px-2 py-1 cursor-pointer"
					>
						그만두기
					</button>
				</form>
			</div>
		</Modal>
	);
};
