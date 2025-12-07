import Modal from "@/widgets/modal/modal";
import CheckIcon from "@/shared/assets/icons/check.svg?react";
import { renderWithBr } from "@/shared/lib/renderWithBr";
import { useLessonModalStore } from "../../model/use-lesson-modal-store";

export default function ReportResultModal({
	type,
}: {
	type: "confirm" | "error";
}) {
	const { isResultOpen, closeResultModal } = useLessonModalStore();
	const title =
		type === "confirm"
			? "회원님의 신고가 접수되었어요."
			: "에러가 발생했습니다.";
	const content =
		type === "confirm"
			? [
					"회원님의 소중한 의견을 모아",
					"더욱 쾌적한 앱 환경을 만들겠습니다.",
					"단, 허위로 신고할 경우 제재 대상이 될 수 있어요.",
				]
			: ["잠시 후 다시 제출해주세요"];

	return (
		<Modal
			isOpen={isResultOpen}
			hasCloseButton={false}
			onClose={closeResultModal}
		>
			<div className="bg-white rounded-2xl w-[500px] lg:w-[600px] flex flex-col items-center pt-[85px] overflow-clip">
				<div className="w-fit bg-main-2 aspect-square rounded-full flex items-center justify-center">
					<CheckIcon className="w-[100px]" />
				</div>
				<h3 className="text-black font-semibold text-2xl tablet-3xl mb-5 mt-[40px]">
					{title}
				</h3>
				<p className="text-[#868686] max-w-[400px] font-normal text-xl tablet:text-2xl mb-[59px] text-center">
					{renderWithBr(content)}
				</p>
				<button
					type="button"
					className="w-full py-[30px] bg-main-2 text-white font-normal text-3xl cursor-pointer"
					onClick={closeResultModal}
				>
					확인
				</button>
			</div>
		</Modal>
	);
}
