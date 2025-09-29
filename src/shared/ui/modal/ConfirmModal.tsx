import { forwardRef, useImperativeHandle, useRef } from "react";
import RabbitIcon from "@/shared/assets/icons/mascot-sad.svg?react";
import { renderWithBr } from "@/shared/lib/renderWithBr";

export interface ConfirmModalRef {
	open: () => void;
	close: () => void;
}

interface ConfirmModalProps {
	title: string[];
	description: string[];
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmModal = forwardRef<ConfirmModalRef, ConfirmModalProps>(
	function ConfirmModal(
		{
			title,
			description,
			confirmText = "확인",
			cancelText = "취소",
			onConfirm,
			onCancel,
		},
		ref,
	) {
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
				className="backdrop:bg-black/60 bg-transparent m-auto"
				onClose={onCancel}
			>
				<div className="bg-white rounded-2xl w-[500px] lg:w-[600px] max-h-[600px] pt-3 pb-6 px-8 flex flex-col items-center gap-1">
					<RabbitIcon width={180} />
					<div className="text-xl font-semibold text-center space-y-1 ">
						<h3 className="font-semibold">{renderWithBr(title)}</h3>
					</div>

					<p className="text-lg font-normal text-center space-y-1 text-gray-600 mb-3">
						{renderWithBr(description)}
					</p>
					<form method="dialog" className="flex flex-col gap-2">
						<button
							type="submit"
							onClick={onCancel}
							className="cursor-pointer p-3 bg-main-2 w-[300px] rounded-full text-white text-lg font-semibold "
						>
							{cancelText}
						</button>
						<button
							type="submit"
							onClick={onConfirm}
							className="text-gray-600 text-xl font-semibold hover:text-gray-800 hover:underline transition-all duration-200 focus:outline-none px-2 py-1 cursor-pointer"
						>
							{confirmText}
						</button>
					</form>
				</div>
			</dialog>
		);
	},
);
