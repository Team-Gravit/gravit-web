import { createFileRoute, Link } from "@tanstack/react-router";
import { BackgroundLayout } from "@/shared/ui/background/background";
import backgroundImg from "@/shared/assets/images/background.jpg";
import ChapterInfo from "@/entities/chapter/ChapterInfo";
import NextIcon from "@/shared/assets/icons/ic-right-arrow.svg?react";
import BookmarkIcon from "@/shared/assets/icons/ic-bookmark.svg?react";
import { useFetchLessons } from "@/entities/learning/model/hooks";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learning/$chapterId/$unitId/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { chapterId, unitId } = Route.useParams();
	const { lessons, chapterInfo, isPending } = useFetchLessons(Number(unitId));

	if (isPending) {
		return <div>로딩중</div>;
	}

	if (!lessons || !chapterInfo) {
		return <div>레슨 정보가 없습니다.</div>;
	}
	return (
		<BackgroundLayout backgroundImage={backgroundImg} gradientOverlay="partial">
			<main className="w-full max-w-[1580px] px-16 lg:px-20 xl:px-24 pt-10 lg:pt-24 pb-44 mx-auto">
				{/* 개념노트 버튼 */}
				<div className="flex flex-row justify-between">
					<ChapterInfo
						chapterName={chapterInfo.chapterName}
						chapterInfoText={chapterInfo.chapterDescription}
					/>
					<Link
						to={"/learning/$chapterId/$unitId/concept-note"}
						params={{ chapterId, unitId }}
						search={{ chapterName: chapterInfo.chapterName }}
						className="
								flex justify-center items-center
								w-[180px] h-[76px]
								bg-[#BA00FF] rounded-[16px]
								shadow-[0_0_16px_0_#C52AFF]
								border-2 border-white
								text-white font-bold text-[30px] leading-[36px]
								hover:brightness-110 transition
								"
					>
						개념노트
					</Link>
				</div>
				<div className="w-full grid grid-rows-[auto_auto] grid-cols-[1fr_1fr] gap-x-8 gap-y-7 lg:gap-x-16 lg:gap-y-14">
					<section className="flex flex-col gap-4">
						<div className="flex items-center gap-6">
							<h3 className="text-white text-2xl font-semibold">북마크</h3>
							<NextIcon className="w-6 text-white" />
						</div>
						<div className="relative w-full rounded-2xl px-8 py-8 bg-white">
							<BookmarkIcon className="absolute top-0 right-0 -translate-y-2 -translate-x-6" />

							<h4 className="text-gray-900 font-semibold text-2xl mb-2">
								북마크
							</h4>
							<p className="text-gray-800 text-xl mb-11">
								북마크한 문제를 풀어요.
							</p>
							<Link
								to={"/learning/$chapterId/$unitId/bookmarked-problems"}
								params={{ chapterId, unitId }}
								className="hover:text-gray-500 font-medium text-xl text-gray-700 flex items-center cursor-pointer"
							>
								문제 풀러 가기
								<NextIcon className="w-5" />
							</Link>
						</div>
					</section>
					<section className="flex flex-col gap-4">
						<div className="flex items-center gap-6">
							<h3 className="text-white text-2xl font-semibold">오답노트</h3>
							<NextIcon className="w-6 text-white" />
						</div>
						<div className="relative w-full rounded-2xl px-8 py-8 bg-white">
							<BookmarkIcon className="absolute top-0 right-0 -translate-y-2 -translate-x-6" />

							<h4 className="text-gray-900 font-semibold text-2xl mb-2">
								오답노트
							</h4>
							<p className="text-gray-800 text-xl mb-11">
								틀린 문제를 복습해요.
							</p>
							<Link
								to={"/learning/$chapterId/$unitId/incorrect-problems"}
								params={{ chapterId, unitId }}
								className="font-medium text-xl text-gray-700 flex items-center cursor-pointer hover:text-gray-500"
							>
								문제 풀러 가기
								<NextIcon className="w-5" />
							</Link>
						</div>
					</section>
				</div>
				<section key={"problems"} className="w-full flex flex-col gap-4">
					<div className="flex items-center gap-6">
						<h3 className="text-white text-2xl font-semibold">문제 리스트</h3>
						<NextIcon className="w-6 text-white" />
					</div>
					<ol className="w-full grid grid-cols-2 gap-4">
						{lessons.map((lesson, idx) => (
							<li
								key={lesson.lessonId}
								className="w-full p-5 border rounded-lg ease-in-out transition-all duration-400 cursor-pointer hover:border-[#8B69FF] hover:bg-[linear-gradient(109deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.10)_100%)] hover:shadow-[0_0_4px_-25px_rgba(0,0,0,0.25)] hover:backdrop-blur-[5px] border-[#531FAD] bg-[linear-gradient(109deg,rgba(36,0,49,0.80)_0%,rgba(36,0,49,0.20)_100%)] shadow-md backdrop-blur-sm"
							>
								<Link
									className="flex flex-col gap-6"
									to="/learning/$chapterId/$unitId/$lessonId"
									params={{
										chapterId,
										unitId,
										lessonId: lesson.lessonId.toString(),
									}}
								>
									<div className="flex items-center">
										<h4 className="inline-block text-white font-bold text-2xl">
											Lesson{(idx + 1).toString().padStart(2, "0")}
										</h4>

										<div className="h-4.5 border-l-2  border-white mx-3" />

										<span className="text-white font-medium text-xl">
											{lesson.isSolved ? "학습 완료" : "학습 전"}
										</span>
									</div>
									<span className="text-xl font-medium text-[rgba(255,255,255,0.8)]">
										{lesson.totalProblem}문제
									</span>
								</Link>
							</li>
						))}
					</ol>
				</section>
			</main>
		</BackgroundLayout>
	);
}
