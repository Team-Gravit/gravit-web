import { createFileRoute, Link } from "@tanstack/react-router";
import backgroundImg from "@/shared/assets/images/background.jpg";
import RightArrowIcon from "@/shared/assets/icons/ic-right-arrow.svg?react";
import { BackgroundLayout } from "@/shared/ui/background/background";
import { useFetchChapterWithUnits } from "@/entities/learning/model/hooks";
import type { Unit } from "@/entities/learning/model/types";
import ContentSectionHeader from "@/entities/chapter/ContentSectionHeader";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learning/$chapterId/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { chapterId } = Route.useParams();

	const { chapterInfo, units } = useFetchChapterWithUnits(Number(chapterId));

	if (!chapterInfo || !units) {
		return <div>정보를 불러오지 못했습니다.</div>;
	}
	return (
		<BackgroundLayout backgroundImage={backgroundImg} gradientOverlay="partial">
			<main className="w-full max-w-[1580px] px-16 lg:px-20 xl:px-24 pt-10 lg:pt-24 pb-44 mx-auto">
				<ContentSectionHeader
					title={chapterInfo.chapterName}
					description={chapterInfo.chapterDescription}
				/>

				<section className="w-full">
					<ol className="w-full flex flex-col gap-8">
						{units.map((unit: Unit, idx) => {
							return (
								<li
									key={unit.unitId}
									className="w-full px-6 py-[18px] bg-white rounded-[1.25rem] flex justify-between cursor-pointer hover:scale-105 ease-in-out duration-300 shadow-[0px_4px_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0_0_33px_0_#7B4AE9]"
								>
									<Link
										to={"/learning/$chapterId/$unitId"}
										params={{ chapterId, unitId: unit.unitId.toString() }}
										className="flex flex-col gap-3 w-full h-full"
									>
										<h3 className="text-black text-xl xl:text-2xl font-semibold leading-none flex items-center justify-between">
											Unit{(idx + 1).toString().padStart(2, "0")} - {unit.title}
											<RightArrowIcon className="w-6" />
										</h3>
										<p className="font-medium text-lg xl:text-xl">
											{unit.description}
										</p>
										<div className="flex items-center gap-2.5">
											<span className="text-gray-500 text-xl xl:text-2xl">
												{unit.progressRate}%
											</span>

											<div className="w-[500px] h-5 rounded-full border-2 border-gray-500 px-[2px] flex items-center">
												<div
													className="h-3 bg-main-gradient rounded-full"
													style={{
														width: `${Math.min(Math.max(unit.progressRate, 3), 100)}%`,
														transition: "width 0.3s ease",
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
