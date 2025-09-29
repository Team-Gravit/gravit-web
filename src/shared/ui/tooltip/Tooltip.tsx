import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({
	positionX = "RIGHT",
	children,
	button,
}: {
	positionX?: "LEFT" | "CENTER" | "RIGHT";
	children: React.ReactNode;
	button: ReactNode;
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isVisible && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const tooltipTop = rect.bottom + 8;
			const buttonCenterX = rect.left + rect.width / 2;

			setPosition({ top: tooltipTop, left: buttonCenterX });
		}
	}, [isVisible]);

	const getTooltipTransform = () => {
		switch (positionX) {
			case "LEFT":
				return "translate-x-0";
			case "CENTER":
				return "-translate-x-1/2";
			case "RIGHT":
				return "-translate-x-8/9";
			default:
				return "-translate-x-full";
		}
	};

	const onHandleMouseHover = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("hover");
		setIsVisible(true);
	};

	const onHandleMouseLeave = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("leave");
		setIsVisible(false);
	};

	return (
		<>
			<button
				ref={buttonRef}
				type="button"
				className="cursor-pointer"
				onMouseEnter={onHandleMouseHover}
				onMouseLeave={onHandleMouseLeave}
			>
				{button}
			</button>

			{isVisible &&
				createPortal(
					<div
						className="fixed z-[9999] pointer-events-none"
						style={{
							top: position.top,
							left: position.left,
						}}
					>
						{/* 꼬리(화살표) - 버튼 중앙 아래에 위치 */}
						<div className="absolute -translate-x-1/2 -translate-y-[10px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black"></div>

						{/* 툴팁 몸통 */}
						<div
							className={`${getTooltipTransform()} w-max bg-black text-white rounded-lg p-2.5`}
						>
							{children}
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
