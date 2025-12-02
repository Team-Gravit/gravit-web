import type { ComponentPropsWithoutRef } from "react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/shared/assets/icons/buttons/x.svg?react";

export interface ModalProps extends ComponentPropsWithoutRef<"dialog"> {
	/**
	 * Modal이 열려있는지에 대한 상태
	 *
	 * @default false
	 */
	isOpen: boolean;
	/**
	 * Modal에 닫기버튼에 대한 여부
	 *
	 * @default true
	 */
	hasCloseButton?: boolean;
	/**
	 * Modal Backdrop을 클릭해서 Modal을 닫을 수 있는 지에 대한 여부
	 * @default true
	 */
	isBackdropClosable?: boolean;
	/** Modal을 닫는 함수 */
	closeModal: () => void;
}

const Modal = ({
	closeModal,
	isOpen = false,
	hasCloseButton = true,
	isBackdropClosable = true,
	children,
	...attributes
}: ModalProps) => {
	const handleEscKeyPress = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape" && isBackdropClosable) {
				closeModal();
			}
		},
		[closeModal, isBackdropClosable],
	);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleEscKeyPress);
		}

		return () => {
			document.body.style.overflow = "auto";
			window.removeEventListener("keydown", handleEscKeyPress);
		};
	}, [isOpen, handleEscKeyPress]);

	const handleBackdropClick = () => {
		if (isBackdropClosable) {
			closeModal();
		}
	};

	const handleBackdropKeyDown = (event: React.KeyboardEvent) => {
		if (isBackdropClosable && (event.key === "Enter" || event.key === " ")) {
			closeModal();
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<>
			{/* Backdrop */}
			<div
				role="button"
				tabIndex={0}
				aria-label="모달 배경 (클릭하면 닫힘)"
				className="fixed inset-0 z-40 bg-black/15 cursor-pointer"
				onClick={handleBackdropClick}
				onKeyDown={handleBackdropKeyDown} // ✅ Fix 7: 키보드 이벤트 추가
			/>
			{/* Modal Dialog */}
			<dialog
				aria-modal={isOpen}
				className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center min-w-80 p-6 rounded-lg border-none bg-white shadow-lg animate-fadeIn"
				{...attributes}
			>
				{/* Close Button */}
				{hasCloseButton && (
					<button
						type="button"
						aria-label="모달 닫기 버튼"
						onClick={closeModal}
						className="absolute top-6 right-6 border-none bg-transparent cursor-pointer"
					>
						<CloseIcon className="w-4 h-4" />
					</button>
				)}
				{children}
			</dialog>
		</>,
		document.body,
	);
};

export default Modal;
