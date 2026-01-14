import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
// import type { ToastProps } from "../../lib/toast/types";
import { cn } from "@/shared/lib/cn";
import type { ToastProps } from "../../lib/toast/types";

const ANIMATION_TIME = 500;

/**
 * 사용자에게 메시지를 전달하는 토스트 UI 컴포넌트입니다.
 * 애니메이션과 함께 나타나고 사라지며, 자동 닫기 및 클릭하여 닫기 기능을 지원합니다.
 * @param type 토스트의 종류 ('error', 'confirm', 'none'). 스타일에 영향을 줄 수 있습니다.
 * @param message 표시할 메시지 내용.
 * @param onClose 토스트가 닫힐 때 호출되는 콜백 함수.
 */
export function Toast({
	type = "confirm",
	top = "6rem",
	bottom = "0px",
	isCloseOnClick = true,
	isAutoClosed = true,
	position = "top",
	showingTime = 3000,
	message,
	onUndo,
	onClose,
	...htmlProps
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	const handleClickToClose = () => {
		if (!isCloseOnClick || !onClose) return;

		setIsVisible(false);
		setTimeout(() => {
			onClose();
		}, ANIMATION_TIME);
	};

	const handleAutoClose = useCallback(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => {
				if (onClose) onClose();
			}, ANIMATION_TIME); // fadeOut 애니메이션 시간과 동일하게 설정
		}, showingTime - ANIMATION_TIME); // 토스트가 내려가는 시간 확보

		return () => {
			clearTimeout(timer);
		};
	}, [onClose, showingTime]);

	useEffect(() => {
		if (isAutoClosed) {
			return handleAutoClose();
		}
	}, [isAutoClosed, handleAutoClose]);

	const positionStyle = {
		[position]: position === "bottom" ? bottom : top,
	};

	return createPortal(
		<div
			{...htmlProps}
			onClick={handleClickToClose}
			className={`-translate-x-1/2 fixed left-1/2 z-50 w-full max-w-md px-4`}
			style={positionStyle}
		>
			<div
				className={cn(
					"flex items-center justify-center rounded-full px-10 py-4 text-2xl transition-all duration-300 bg-black/60",
					isVisible ? "animate-fade-in-y" : "animate-fade-out-y",
				)}
			>
				<span className="text-white">{message}</span>

				{/* 오른쪽: 되돌리기 버튼 */}
				{onUndo && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation(); // 토스트 닫기 방지
							onUndo();
						}}
						className="whitespace-nowrap font-semibold text-blue-400 text-sm transition-colors hover:text-blue-300"
					>
						되돌리기
					</button>
				)}
			</div>
		</div>,
		document.body,
	);
}
