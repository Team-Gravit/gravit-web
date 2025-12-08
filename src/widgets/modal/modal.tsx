import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";
import CloseButton from "@/shared/ui/button/close-button";

export default function Modal({
	className,
	isOpen,
	children,
	onClose,
	contentRef,
	hasCloseButton = true,
	isBackdropClosable = true,
}: {
	className?: string;
	isOpen: boolean;
	isBackdropClosable?: boolean;
	children?: ReactNode;
	onClose: () => void;
	contentRef?: React.RefObject<HTMLDivElement | null>;
	hasCloseButton?: boolean;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}

		if (isOpen) {
			document.body.style.cssText = `
				position: fixed; 
				top: -${window.scrollY}px;
				overflow-y: scroll;	
				width: 100%;
			`;
			dialog.showModal();
		} else {
			const scrollY = document.body.style.top;
			document.body.style.cssText = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
			try {
				dialog.close();
			} catch (err) {
				console.log(err);
			}
		}
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
		};
	}, [isOpen]);

	return createPortal(
		// biome-ignore lint/a11y/useKeyWithClickEvents: The <dialog> element with an onClick handler for backdrop clicks is accessible. Keyboard interaction (ESC key) is handled natively by the dialog element to trigger the onClose event.
		<dialog
			ref={dialogRef}
			onClose={onClose}
			onClick={(e) => {
				if (!isBackdropClosable) return;
				const contentEl = contentRef?.current;
				const target = e.target as Node | null;

				// 닫기: 컨텐츠 영역 밖을 클릭한 경우
				if (!contentEl || (target && !contentEl.contains(target))) onClose();
			}}
			className="backdrop:bg-black/60 m-auto p-0 border-0 bg-transparent rounded-2xl overflow-hidden"
		>
			<div className={cn("bg-white rounded-2xl", className)} ref={contentRef}>
				{hasCloseButton && (
					<CloseButton
						className="-translate-x-2 absolute top-0 right-0 translate-y-2 hover:rounded-lg hover:bg-gray-300"
						onClose={onClose}
					/>
				)}
				{children}
			</div>
		</dialog>,
		document.body,
	);
}
