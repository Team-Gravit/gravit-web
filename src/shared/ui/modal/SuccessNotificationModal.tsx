import { forwardRef, useImperativeHandle, useRef } from "react";
import CheckIcon from "@/shared/assets/icons/check.svg?react";
import { renderWithBr } from "@/shared/lib/renderWithBr";

export interface SuccessModalRef {
	open: () => void;
	close: () => void;
}

interface ModalProps {
	title: string[];
	description: string[];
	onSubmit: () => void;
}

export const SuccessNotificationModal = forwardRef<SuccessModalRef, ModalProps>(
	function SuccessNotificationModal({ title, description, onSubmit }, ref) {
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
			>
				<div className="bg-white rounded-2xl w-[500px] lg:w-[600px] flex flex-col items-center pt-[85px] overflow-clip">
					<CheckIcon className="w-[100px]" />
					<h3 className="text-black font-semibold text-2xl tablet-3xl mb-5 mt-[40px]">
						{title}
					</h3>
					<p className="text-[#868686] max-w-[400px] font-normal text-xl tablet:text-2xl mb-[59px] text-center">
						{renderWithBr(description)}
					</p>
					<button
						type="button"
						className="w-full py-[30px] bg-main-2 text-white font-normal text-3xl cursor-pointer"
						onClick={() => {
							onSubmit();
							dialogRef.current?.close();
						}}
					>
						확인
					</button>
				</div>
			</dialog>
		);
	},
);
