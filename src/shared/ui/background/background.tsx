import type { ReactNode } from "react";

type GradientOverlay = "none" | "partial" | "full";

interface ChapterPageLayoutProps {
	backgroundImage: string;
	/**
	 * Gradient 오버레이 타입
	 * - 'none': gradient 없음
	 * - 'partial': 상단 일부만 gradient
	 * - 'full': 전체 화면에 gradient
	 */
	gradientOverlay?: GradientOverlay;

	/**
	 * 배경 색상 (기본값: #1e0861)
	 */
	backgroundColor?: string;

	children: ReactNode;
}

export function BackgroundLayout({
	backgroundImage,
	gradientOverlay = "none",
	backgroundColor = "#1e0861",
	children,
}: ChapterPageLayoutProps) {
	return (
		<div
			className="h-full w-full bg-no-repeat flex-grow flex flex-col justify-start pt-[var(--header-height)] relative"
			style={{
				backgroundColor,
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover, 110px 110px",
				backgroundPosition: "center, top-left",
				backgroundRepeat: "no-repeat, no-repeat",
				minHeight: "calc(100vh - var(--header-height))",
			}}
		>
			{gradientOverlay === "full" && (
				<div
					className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-100 pointer-events-none"
					style={{ zIndex: 0 }}
				/>
			)}

			{gradientOverlay === "partial" && (
				<div
					className="absolute top-0 left-0 right-0 h-[270px] bg-gradient-to-b from-black to-transparent pointer-events-none"
					style={{ zIndex: 0 }}
				/>
			)}

			{/* Content */}
			<div className="relative z-10 w-full flex-grow flex flex-col">
				{children}
			</div>
		</div>
	);
}
