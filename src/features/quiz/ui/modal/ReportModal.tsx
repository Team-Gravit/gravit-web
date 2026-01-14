import { useState } from "react";
import { useSubmitReport } from "@/features/learning/api/use-submit-report";
import { cn } from "@/shared/lib/cn";
import Modal from "@/widgets/modal/modal";
import { useLessonModalStore } from "../../model/use-lesson-modal-store";
import CheckIcon from "./assets/report-check.svg?react";
import ReportIcon from "./assets/report-color.svg?react";

export interface ReportModalRef {
	open: () => void;
	close: () => void;
}

export type ReportType =
	| "TYPO_ERROR"
	| "CONTENT_ERROR"
	| "ANSWER_ERROR"
	| "OTHER_ERROR";

const OPTIONS = [
	{ reportType: "TYPO_ERROR", text: "문제/선지에 오탈자가 있습니다." },
	{ reportType: "CONTENT_ERROR", text: "문제 자체에 오류가 있습니다." },
	{ reportType: "ANSWER_ERROR", text: "답안에 오류가 있습니다." },
	{ reportType: "OTHER_ERROR", text: "기타" },
] as const;

interface ReportFormData {
	reportType: ReportType | null;
	content: string;
}

const initialReportState: ReportFormData = {
	reportType: null,
	content: "",
};

export default function ReportModal({ problemId }: { problemId: number }) {
	const { isReportOpen, closeReportModal } = useLessonModalStore();

	const { mutate: onSubmit } = useSubmitReport();

	const [formData, setFormData] = useState<ReportFormData>(initialReportState);

	return (
		<Modal
			isOpen={isReportOpen}
			onClose={closeReportModal}
			hasCloseButton={false}
			isBackdropClosable={false}
		>
			<form
				className="rounded-2xl p-4 flex flex-col w-[450px] md:w-[600px] lg:w-[800px] max-h-[600px]  items-center gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					const reportType = formData.reportType;
					if (reportType) {
						onSubmit({ reportType, content: formData.content, problemId });
					}
					setFormData(initialReportState);
				}}
			>
				<div className="flex flex-col items-center w-full">
					<ReportIcon />
					<h3 className="text-[20px] font-semibold leading-normal">신고하기</h3>
				</div>
				<ul className="w-full flex flex-col gap-2">
					{OPTIONS.map((option) => {
						const isSelected = option.reportType === formData.reportType;
						return (
							<li
								key={option.reportType}
								className="bg-gray-200 rounded-[10px] flex px-4 py-2 w-full"
							>
								<label className="w-full flex gap-2 items-center cursor-pointer">
									<input
										type="checkbox"
										checked={isSelected}
										onChange={() => {
											setFormData((prev) => {
												return { ...prev, reportType: option.reportType };
											});
										}}
										className="sr-only peer"
									/>
									<span
										className={cn(
											"w-6 h-6 flex items-center justify-center rounded-lg transition-colors",
											isSelected
												? "bg-main-2 text-white"
												: "bg-none text-gray-600 border-2 border-gray-600",
										)}
									>
										<CheckIcon width={14} height={14} />
									</span>
									<span className="text-gray-900 text-[20px] font-normal">
										{option.text}
									</span>
								</label>
							</li>
						);
					})}
				</ul>
				<textarea
					className="w-full h-[102px] p-3 border border-gray-500 rounded-[10px] placeholder-text-[20px] font-medium resize-none"
					placeholder="신고 사유"
					value={formData.content}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							content: e.target.value,
						}));
					}}
				/>
				<p className="flex gap-[19px] h-fit w-full">
					<button
						type="button"
						className="gray-btn cursor-pointer flex-1 py-4"
						onClick={() => {
							setFormData(initialReportState);
							closeReportModal();
						}}
					>
						그만두기
					</button>
					<button
						disabled={formData.reportType === null}
						type="submit"
						className="py-4 primary-btn cursor-pointer flex-1 disabled:opacity-50"
					>
						제출하기
					</button>
				</p>
			</form>
		</Modal>
	);
}
