import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import backgroundImg from "@/shared/assets/images/background.jpg";
import RightArrowIcon from "@/shared/assets/icons/ic-right-arrow.svg?react";
import { BackgroundLayout } from "@/shared/ui/background/background";
import ChapterInfo from "@/entities/chapter/ChapterInfo";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/chapters/$chapterId/units/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { chapterId } = useParams({
		from: "/_authenticated/_fixed-header-layout/chapters/$chapterId/units/",
	});
	return (
		<BackgroundLayout backgroundImage={backgroundImg} gradientOverlay="partial">
			<main className="w-full max-w-[1580px] px-16 lg:px-20 xl:px-24 pt-10 lg:pt-24 pb-44 mx-auto">
				<ChapterInfo
					chapterName="자료구조"
					chapterInfoText="배열, 연결리스트, 스택, 등 기본적인 자료구조의 개념과 구현을
						학습하는 챕터입니다"
				/>

				<section className="w-full">
					<ol className="w-full flex flex-col gap-8">
						{[1, 2, 3, 4, 5, 6].map((item) => {
							return (
								<li
									key={item}
									className="w-full px-10 py-9 bg-white rounded-[1.25rem] flex justify-between cursor-pointer hover:scale-105 ease-in-out duration-300 shadow-[0px_4px_4px_0_rgba(0,0,0,0.25)] hover:shadow-[0_0_33px_0_#7B4AE9]"
								>
									<Link
										to={"/chapters/$chapterId/units/$unitId/lessons"}
										params={{ chapterId, unitId: item.toString() }}
										className="flex flex-col gap-5"
									>
										<h3 className="text-black text-4xl lg:text-[2.625rem] font-semibold leading-none">
											Unit0{item} - 연결리스트
										</h3>
										<p className="font-medium  text-3xl lg:text-[2.363rem]">
											설명이 같이 있었으면 좋겠는데
										</p>
									</Link>
									<RightArrowIcon />
								</li>
							);
						})}
					</ol>
				</section>
			</main>
		</BackgroundLayout>
	);
}
