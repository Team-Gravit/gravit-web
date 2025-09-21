import { createFileRoute } from "@tanstack/react-router";
import backgroundImg from "@/shared/assets/images/background.jpg";
import { getPlanetImage } from "@/shared/lib/planet/utils";
import asteroidImg from "@/shared/assets/images/planets/asteroid.png";
import { cn } from "@/shared/lib/cn";
import Popover from "@/shared/ui/popover/Popover";
import UnitPopover from "@/widgets/learning-widget/UnitPopover";

export const Route = createFileRoute("/_fixed-header-layout/learn/$chapterId/")(
	{
		component: RouteComponent,
	},
);

const mockData = [
	// Chapter 1: 자료구조
	[
		{
			unitProgressDetailResponse: {
				unitId: 1,
				name: "배열",
				totalLesson: 1,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 1,
					name: "배열",
					isCompleted: false,
				},
			],
		},
		{
			unitProgressDetailResponse: {
				unitId: 2,
				name: "연결리스트",
				totalLesson: 2,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 2,
					name: "연결리스트 1",
					isCompleted: false,
				},
				{
					lessonId: 3,
					name: "연결리스트 2",
					isCompleted: false,
				},
			],
		},
		{
			unitProgressDetailResponse: {
				unitId: 3,
				name: "스택",
				totalLesson: 1,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 4,
					name: "스택",
					isCompleted: false,
				},
			],
		},
		{
			unitProgressDetailResponse: {
				unitId: 4,
				name: "큐",
				totalLesson: 1,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 5,
					name: "큐",
					isCompleted: false,
				},
			],
		},
		{
			unitProgressDetailResponse: {
				unitId: 5,
				name: "힙",
				totalLesson: 1,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 6,
					name: "힙",
					isCompleted: false,
				},
			],
		},
		{
			unitProgressDetailResponse: {
				unitId: 6,
				name: "해시",
				totalLesson: 1,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 7,
					name: "해시",
					isCompleted: false,
				},
			],
		},
		{
			unitProgressDetailResponse: {
				unitId: 7,
				name: "트리",
				totalLesson: 3,
				completedLesson: 0,
			},
			lessonProgressSummaryResponses: [
				{
					lessonId: 8,
					name: "트리 1",
					isCompleted: false,
				},
				{
					lessonId: 9,
					name: "트리 2",
					isCompleted: false,
				},
				{
					lessonId: 10,
					name: "트리 3",
					isCompleted: false,
				},
			],
		},
	],
];

function RouteComponent() {
	const { chapterId } = Route.useParams();
	const chapterPlanetImg = getPlanetImage(Number(chapterId));

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
		const horizontalClass = positions[idx % 7];

		return {
			className: `absolute cursor-pointer ${horizontalClass}`,
			style: { top: `${currentTop}px` },
		};
	};

	return (
		<main
			className="bg-no-repeat flex-grow flex flex-col justify-start bg-[#1e0861] pt-[var(--header-height)]"
			style={{
				backgroundImage: `url(${backgroundImg})`,
				backgroundSize: "cover, 110px 110px",
				backgroundPosition: "center, top-left",
				backgroundRepeat: "no-repeat, no-repeat",
				minHeight: "calc(100vh - var(--header-height))",
				height: `${Math.min(5148, 120 + mockData[Number(chapterId) - 1].length * 120 + 300)}px`,
			}}
		>
			<div className="relative w-full">
				{mockData[Number(chapterId) - 1].map((unit, idx) => {
					const { unitId, name } = unit.unitProgressDetailResponse;
					const { className, style } = getAsteroidPosition(idx);

					return (
						<div className={cn(className)} style={style} key={unitId}>
							<Popover
								content={
									<UnitPopover
										unitId={unitId.toString()}
										name={name}
										chapterId={chapterId}
									/>
								}
							>
								<img
									src={idx === 0 ? chapterPlanetImg : asteroidImg}
									className="w-[80px] lg:w-[110px] z-10"
									alt={`${name} 행성 ${unitId}-${idx + 1}`}
								/>
							</Popover>
						</div>
					);
				})}
			</div>
		</main>
	);
}
