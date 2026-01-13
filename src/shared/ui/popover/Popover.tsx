import { type ReactNode, useEffect, useId, useRef, useState } from "react";

const Popover = ({
	children,
	content,
}: {
	children: ReactNode;
	content: ReactNode;
}) => {
	const [isVisible, setIsVisible] = useState(false); // 팝오버 표시/숨김 상태 관리
	const popoverRef = useRef<HTMLDivElement>(null); // 팝오버 엘리먼트에 대한 참조
	const triggerRef = useRef<HTMLButtonElement>(null); // 팝오버를 트리거하는 버튼 엘리먼트에 대한 참조

	const popoverId = useId();

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (
				popoverRef.current &&
				!popoverRef.current.contains(target) &&
				triggerRef.current &&
				!triggerRef.current.contains(target)
			) {
				setIsVisible(false); // 외부 클릭 시 팝오버 닫기
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative inline-block">
			<button
				type="button"
				ref={triggerRef}
				onClick={toggleVisibility}
				className="popover-trigger cursor-pointer"
				aria-haspopup="true"
				aria-expanded={isVisible}
				aria-controls="popover-content"
			>
				{children}
			</button>
			{isVisible && (
				<div
					id={popoverId}
					ref={popoverRef}
					className="popover-content"
					role="dialog"
					aria-modal="true"
				>
					{content}
				</div>
			)}
		</div>
	);
};

export default Popover;
