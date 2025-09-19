import { useState, type ReactNode } from "react";

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

	// positionX에 따른 툴팁 몸통 위치 설정
	const getTooltipPosition = () => {
		switch (positionX) {
			case "LEFT":
				return "left-0 translate-x-0";
			case "CENTER":
				return "left-1/2 -translate-x-1/2";
			case "RIGHT":
				return "right-0 translate-x-0";
			default:
				return "right-0 translate-x-0";
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
		<div className="relative group inline-block z-30">
			<button
				type="button"
				onMouseEnter={onHandleMouseHover}
				onMouseLeave={onHandleMouseLeave}
			>
				{button}
			</button>

			{isVisible && (
				<>
					{/* 꼬리(화살표) - 버튼 중앙 아래에 고정 */}
					<div className="absolute left-1/2 -translate-x-1/2 top-full translate-y-1 hidden group-hover:block w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-black pointer-events-none z-10"></div>

					{/* 툴팁 몸통 - positionX에 따라 위치 변경 */}
					<div
						className={`absolute ${getTooltipPosition()} top-full translate-x-1.5 translate-y-3.5 mb-2 hidden group-hover:block w-max bg-black text-white rounded-lg p-2.5 pointer-events-none`}
					>
						{children}
					</div>
				</>
			)}
		</div>
	);
}
