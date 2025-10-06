import type { ReactNode } from "react";

const CircularSegmentIndicator = ({
	children,
	totalLessonsCount,
	completedLessonsCount,
}: {
	children: ReactNode;
	totalLessonsCount: number;
	completedLessonsCount: number;
}) => {
	const progressPercentage = (completedLessonsCount / totalLessonsCount) * 100;

	const settings = {
		segmentWidth: 17,
		spaceBetweenSegments: 25,
		activeSegmentColor: "#81DACD",
		inactiveSegmentColor: "#FFFFFF",
		animationDuration: 0.5,
		showInactiveSegments: true,
	};

	// 도를 라디안으로 변환
	const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

	// 세그먼트 경로 계산
	const calculateSegmentPath = (
		segmentIndex: number,
		radius: number,
		centerX: number,
		centerY: number,
	) => {
		if (totalLessonsCount === 1) {
			const startAngle = -Math.PI / 2; // 12시 방향 시작
			const endAngle = startAngle + 2 * Math.PI - 0.001; // 거의 완전한 원 (0.001은 SVG 렌더링을 위한 작은 간격)

			const startX = centerX + radius * Math.cos(startAngle);
			const startY = centerY + radius * Math.sin(startAngle);
			const endX = centerX + radius * Math.cos(endAngle);
			const endY = centerY + radius * Math.sin(endAngle);

			return {
				path: `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`,
				circumference: radius * 2 * Math.PI,
				startAngle,
				endAngle,
			};
		}

		const totalGapSpace = totalLessonsCount * settings.spaceBetweenSegments;
		const totalGapSpaceInRadians = degreesToRadians(totalGapSpace);

		const totalSegmentSpace = 2 * Math.PI - totalGapSpaceInRadians;
		const singleSegmentSpace = totalSegmentSpace / totalLessonsCount;

		const halfGapSpace = degreesToRadians(settings.spaceBetweenSegments) / 2;

		const startAngle =
			singleSegmentSpace * segmentIndex +
			halfGapSpace +
			2 * halfGapSpace * segmentIndex -
			Math.PI / 2; // -90도로 12시 방향 시작
		const endAngle = startAngle + singleSegmentSpace;

		const startX = centerX + radius * Math.cos(startAngle);
		const startY = centerY + radius * Math.sin(startAngle);
		const endX = centerX + radius * Math.cos(endAngle);
		const endY = centerY + radius * Math.sin(endAngle);

		const largeArcFlag = singleSegmentSpace > Math.PI ? 1 : 0;

		return {
			path: `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
			circumference: radius * singleSegmentSpace,
			startAngle,
			endAngle,
		};
	};

	// 현재 진행도에 따른 세그먼트 상태 계산
	const calculateSegmentProgress = (
		segmentIndex: number,
		totalProgress: number,
	) => {
		const progressPerSegment = 100 / totalLessonsCount;
		const segmentStartProgress = segmentIndex * progressPerSegment;
		const segmentEndProgress = (segmentIndex + 1) * progressPerSegment;

		if (totalProgress <= segmentStartProgress) return 0;
		if (totalProgress >= segmentEndProgress) return 1;
		return (totalProgress - segmentStartProgress) / progressPerSegment;
	};

	// 반응형 크기 계산
	const baseRadius = 75;
	const baseSvgSize = 170;
	const baseCenter = 85;

	// 작은 화면에서 크기 조정 (w-[80px]에 맞춤)
	const scaleFactor = 0.73; // 80/110 비율

	const radius = baseRadius;
	const centerX = baseCenter;
	const centerY = baseCenter;
	const svgSize = baseSvgSize;

	// 작은 화면용 크기
	const smallRadius = baseRadius * scaleFactor;
	const smallSvgSize = baseSvgSize * scaleFactor;
	const smallCenter = baseCenter * scaleFactor;

	// 세그먼트 ID 생성 (안정적인 key를 위해)
	const generateSegmentId = (
		type: "inactive" | "active",
		segmentIndex: number,
	) => `${type}-segment-${totalLessonsCount}-${segmentIndex}`;

	return (
		<div className="relative flex items-center justify-center">
			{/* 큰 화면용 SVG (lg: 이상) */}
			<svg
				width={svgSize}
				height={svgSize}
				className="absolute hidden lg:block"
				role="img"
				aria-label={`학습 진행도: ${totalLessonsCount}개 중 ${completedLessonsCount}개 완료`}
			>
				<title>학습 진행도 표시기</title>

				{/* 비활성 세그먼트 (배경) */}
				{settings.showInactiveSegments &&
					Array.from({ length: totalLessonsCount }, (_, index) => {
						const segmentData = calculateSegmentPath(
							index,
							radius,
							centerX,
							centerY,
						);
						return (
							<path
								key={generateSegmentId("inactive", index)}
								d={segmentData.path}
								fill="none"
								stroke={settings.inactiveSegmentColor}
								strokeWidth={settings.segmentWidth}
								strokeLinecap="round"
								opacity="0.6"
							/>
						);
					})}

				{/* 활성 세그먼트 (진행도) */}
				{Array.from({ length: totalLessonsCount }, (_, index) => {
					const segmentData = calculateSegmentPath(
						index,
						radius,
						centerX,
						centerY,
					);
					const segmentProgress = calculateSegmentProgress(
						index,
						progressPercentage,
					);
					const strokeDasharray = segmentData.circumference;
					const strokeDashoffset =
						segmentData.circumference * (1 - segmentProgress);

					return (
						<path
							key={generateSegmentId("active", index)}
							d={segmentData.path}
							fill="none"
							stroke={settings.activeSegmentColor}
							strokeWidth={settings.segmentWidth}
							strokeLinecap="round"
							strokeDasharray={strokeDasharray}
							strokeDashoffset={strokeDashoffset}
							style={{
								transition: `stroke-dashoffset ${settings.animationDuration}s ease-in-out`,
							}}
						/>
					);
				})}
			</svg>

			{/* 작은 화면용 SVG */}
			<svg
				width={smallSvgSize}
				height={smallSvgSize}
				className="absolute block lg:hidden"
				role="img"
				aria-label={`학습 진행도: ${totalLessonsCount}개 중 ${completedLessonsCount}개 완료`}
			>
				<title>학습 진행도 표시기</title>

				{/* 비활성 세그먼트 (배경) - 작은 화면 */}
				{settings.showInactiveSegments &&
					Array.from({ length: totalLessonsCount }, (_, index) => {
						const segmentData = calculateSegmentPath(
							index,
							smallRadius,
							smallCenter,
							smallCenter,
						);
						return (
							<path
								key={generateSegmentId("inactive", index)}
								d={segmentData.path}
								fill="none"
								stroke={settings.inactiveSegmentColor}
								strokeWidth={settings.segmentWidth * scaleFactor}
								strokeLinecap="round"
								opacity="0.6"
							/>
						);
					})}

				{/* 활성 세그먼트 (진행도) - 작은 화면 */}
				{Array.from({ length: totalLessonsCount }, (_, index) => {
					const segmentData = calculateSegmentPath(
						index,
						smallRadius,
						smallCenter,
						smallCenter,
					);
					const segmentProgress = calculateSegmentProgress(
						index,
						progressPercentage,
					);
					const strokeDasharray = segmentData.circumference;
					const strokeDashoffset =
						segmentData.circumference * (1 - segmentProgress);

					return (
						<path
							key={generateSegmentId("active", index)}
							d={segmentData.path}
							fill="none"
							stroke={settings.activeSegmentColor}
							strokeWidth={settings.segmentWidth * scaleFactor}
							strokeLinecap="round"
							strokeDasharray={strokeDasharray}
							strokeDashoffset={strokeDashoffset}
							style={{
								transition: `stroke-dashoffset ${settings.animationDuration}s ease-in-out`,
							}}
						/>
					);
				})}
			</svg>

			{/* 중앙 컨텐츠 영역 - 반응형 크기 */}
			<div className="relative z-10 w-[80px] h-[80px] lg:w-[110px] lg:h-[110px] flex items-center justify-center">
				{children}
			</div>
		</div>
	);
};

export default CircularSegmentIndicator;
