import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import ReportIcon from "./assets/report-color.svg?react";
import CheckIcon from "./assets/report-check.svg?react";
import { cn } from "@/shared/lib/cn";
import {
	SuccessNotificationModal,
	type SuccessModalRef,
} from "@/shared/ui/modal/SuccessNotificationModal";

export interface ReportModalRef {
	open: () => void;
	close: () => void;
}

interface ReportModalProps {
	onSubmit: (reportType: ReportType, content: string) => void;
	onCancel: () => void;
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

export const ReportModal = forwardRef<ReportModalRef, ReportModalProps>(
	function ReportModal({ onSubmit, onCancel }, ref) {
		const dialogRef = useRef<HTMLDialogElement>(null);
		const successModalRef = useRef<SuccessModalRef>(null);

		const [formData, setFormData] =
			useState<ReportFormData>(initialReportState);

		useImperativeHandle(ref, () => ({
			open() {
				dialogRef.current?.showModal();
			},
			close() {
				setFormData({ ...initialReportState });
				dialogRef.current?.close();
			},
		}));

		return (
			<>
				<dialog
					ref={dialogRef}
					// onClose={onCancel}
					className="backdrop:bg-black/60 bg-transparent m-auto"
				>
					<form
						className="bg-white rounded-2xl w-[500px] lg:w-[600px] max-h-[600px] p-4 flex flex-col items-center gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							if (formData.reportType) {
								onSubmit(formData.reportType, formData.content);
								dialogRef.current?.close();
								successModalRef.current?.open();
							}
						}}
					>
						<div className="flex flex-col items-center w-full">
							<ReportIcon />
							<h3 className="text-[20px] font-semibold leading-normal">
								신고하기
							</h3>
						</div>
						<ul className="w-full flex flex-col gap-2">
							{OPTIONS.map((option) => {
								const isSelected = option.reportType === formData.reportType;
								return (
									<li
										key={option.reportType}
										className="bg-gray-200 rounded-[10px] flex px-4 py-3"
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
							className="w-full h-[102px] p-3 border border-gray-500 rounded-[10px] placeholder-text-[20px] font-medium"
							placeholder="신고 사유"
							value={formData.content}
							onChange={(e) => {
								setFormData((prev) => ({
									...prev,
									content: e.target.value,
								}));
							}}
						/>
						<p className="flex gap-[19px] h-[56px] w-full">
							<button
								type="button"
								className="gray-btn cursor-pointer flex-1"
								onClick={() => {
									onCancel();
									setFormData(initialReportState);
									dialogRef.current?.close();
								}}
							>
								그만두기
							</button>
							<button
								disabled={formData.reportType === null}
								type="submit"
								className="primary-btn cursor-pointer flex-1 disabled:opacity-50"
							>
								제출하기
							</button>
						</p>
					</form>
				</dialog>
				<SuccessNotificationModal
					onSubmit={onCancel}
					ref={successModalRef}
					title={["회원님의 신고가 접수되었어요."]}
					description={[
						"회원님의 소중한 의견을 모아",
						"더욱 쾌적한 앱 환경을 만들겠습니다.",
						"단, 허위로 신고할 경우 제재 대상이 될 수 있어요.",
					]}
				/>
			</>
		);
	},
);
