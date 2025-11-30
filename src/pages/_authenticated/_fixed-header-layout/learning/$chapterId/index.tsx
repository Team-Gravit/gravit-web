import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import backgroundImg from "@/shared/assets/images/background.jpg";
import RightArrowIcon from "@/shared/assets/icons/ic-right-arrow.svg?react";
import { BackgroundLayout } from "@/shared/ui/background/background";
import ChapterInfo from "@/entities/chapter/ChapterInfo";
import { useFetchChapterWithUnits } from "@/entities/learning/model/hooks";
import type { Unit } from "@/entities/learning/model/types";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learning/$chapterId/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { chapterId } = useParams({
		from: "/_authenticated/_fixed-header-layout/learning/$chapterId/",
	});

	const { chapterInfo, units } = useFetchChapterWithUnits(Number(chapterId));

	if (!chapterInfo || !units) {
		return <div>정보를 불러오지 못했습니다.</div>;
	}
	return (
		<BackgroundLayout backgroundImage={backgroundImg} gradientOverlay="partial">
			<main className="w-full max-w-[1580px] px-16 lg:px-20 xl:px-24 pt-10 lg:pt-24 pb-44 mx-auto">
				<ChapterInfo
					chapterName={chapterInfo.chapterName}
					chapterInfoText={chapterInfo.chapterDescription}
				/>

				<section className="w-full">
					<ol className="w-full flex flex-col gap-8">
						{units.map((unit: Unit) => {
							return (
								<li
									key={unit.unitId}
									className="w-full px-10 py-9 bg-white rounded-[1.25rem] flex justify-between cursor-pointer hover:scale-105 ease-in-out duration-300 shadow-[0px_4px_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0_0_33px_0_#7B4AE9]"
								>
									<Link
										to={"/learning/$chapterId/$unitId"}
										params={{ chapterId, unitId: unit.unitId.toString() }}
										className="flex flex-col gap-5 w-full h-full"
									>
										<h3 className="text-black text-3xl xl:text-4xl font-semibold leading-none flex items-center justify-between">
											Unit{unit.unitId} - {unit.title}
											<RightArrowIcon />
										</h3>
										<p className="font-medium text-2xl xl:text-3xl">
											{unit.description}
										</p>
										<div className="flex items-center gap-2.5">
											<span className="text-gray-500 text-2xl xl:text-3xl">
												{unit.progressRate}%
											</span>
											<div className="relative w-[500px] h-6 rounded-full border-2 border-gray-500">
												<div
													className="absolute left-0 inset-y-0 my-auto translate-x-[2px] h-4 bg-main-gradient rounded-full"
													style={{
														width: `${Math.min(Math.max(unit.progressRate, 3), 100)}%`,
													}}
												/>
											</div>
										</div>
									</Link>
								</li>
							);
						})}
					</ol>
				</section>
			</main>
		</BackgroundLayout>
	);
}
