import { createFileRoute } from "@tanstack/react-router";
import backgroundImg from "@/shared/assets/images/background.jpg";
import { getAsteroidImg, getPlanetImage } from "@/shared/lib/planet/utils";
import { cn } from "@/shared/lib/cn";
import Popover from "@/shared/ui/popover/Popover";
import UnitPopover from "@/widgets/learning-widget/UnitPopover";
import { useFetchUnits } from "@/entities/learning/model/hooks";
import CircularSegmentIndicator from "@/entities/learning/ui/CircularSegmentIndicator";

export const Route = createFileRoute("/_fixed-header-layout/learn/$chapterId/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { chapterId } = Route.useParams();
	const { units, chapterInfo } = useFetchUnits(Number(chapterId));

	if (!units) {
		return <div>유닛이 없습니다.</div>;
	} else {
		console.log(units);
	}

	const chapterPlanetImg = getPlanetImage(Number(chapterId));

	const unitsUnlockStatus = units.map((_, index) => {
		if (index === 0) return true;
		return units[index - 1].completedLesson === units[index - 1].totalLesson;
	});
	const getAsteroidPosition = (idx: number) => {
		const baseTop = 120;
		const verticalGap = 120;
		const currentTop = baseTop + verticalGap * idx;

		const positions = [
			"right-[20%]",
			"right-[40%]",
			"right-[60%]",
			"right-[80%]",
			"right-[60%]",
			"right-[40%]",
			"right-[20%]",
		];
		const horizontalClass = positions[idx % 6];

		return {
			className: `absolute cursor-pointer ${horizontalClass}`,
			style: { top: `${currentTop}px` },
		};
	};

	const { className, style } = getAsteroidPosition(units.length);

	return (
		<main
			className="bg-no-repeat flex-grow flex flex-col justify-start bg-[#1e0861] pt-[var(--header-height)]"
			style={{
				backgroundImage: `url(${backgroundImg})`,
				backgroundSize: "cover, 110px 110px",
				backgroundPosition: "center, top-left",
				backgroundRepeat: "no-repeat, no-repeat",
				minHeight: "calc(100vh - var(--header-height))",
				height: `${Math.min(5148, 120 + units.length * 120 + 300)}px`,
			}}
		>
			<div className="absolute w-full h-[330px] bg-linear-to-b from-black to-transparent opacity-100">
				<section className="relative left-[100px] top-[70px] lg:left-[126px] lg:top-[100px] max-w-[300px] lg:max-w-[400px]">
					<h2 className="text-white font-semibold text-3xl lg:text-4xl mb-4">
						{chapterInfo?.name}
					</h2>
					<p className="text-white font-semibold text-xl lg:text-2xl">
						{chapterInfo?.description}
					</p>
				</section>
			</div>
			<div className="relative w-full">
				{units.map((unit, idx) => {
					const { unitId, name: unitName } = unit;
					const lessons = unit.lessons;
					// const lessonId = lessons[0].lessonId;
					const lessonId =
						lessons.find((lesson) => !lesson.isCompleted)?.lessonId ??
						lessons[0]?.lessonId;

					const { className, style } = getAsteroidPosition(idx);
					const isUnLocked = unitsUnlockStatus[idx];

					return (
						<div className={cn(className)} style={style} key={unitId}>
							<Popover
								content={
									<UnitPopover
										unitId={unitId.toString()}
										lessonId={lessonId.toString()}
										lessonName={unitName}
										isActive={isUnLocked}
									/>
								}
							>
								{isUnLocked && (
									<CircularSegmentIndicator
										totalLessonsCount={unit.totalLesson}
										completedLessonsCount={unit.completedLesson}
									>
										<img
											src={getAsteroidImg(isUnLocked)}
											className="w-[80px] lg:w-[110px] z-10"
											alt={`${unitName} 행성`}
										/>
									</CircularSegmentIndicator>
								)}
								{!isUnLocked && (
									<img
										src={getAsteroidImg(isUnLocked)}
										className="w-[80px] lg:w-[110px] z-10"
										alt={`${unitName} 행성`}
									/>
								)}
							</Popover>
						</div>
					);
				})}
				<img
					alt="행성"
					src={chapterPlanetImg}
					className={cn("w-[80px] lg:w-[110px] z-10", className)}
					style={style}
				/>
			</div>
		</main>
	);
}
