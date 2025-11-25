import { createFileRoute } from "@tanstack/react-router";
import { BackgroundLayout } from "@/shared/ui/background/background";
import backgroundImg from "@/shared/assets/images/background.jpg";
import ChapterInfo from "@/entities/chapter/ChapterInfo";
import NextIcon from "@/shared/assets/icons/ic-right-arrow.svg?react";
import BookmarkIcon from "@/shared/assets/icons/ic-bookmark.svg?react";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/chapters/$chapterId/units/$unitId/lessons/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<BackgroundLayout backgroundImage={backgroundImg} gradientOverlay="partial">
			<main className="w-full max-w-[1580px] px-16 lg:px-20 xl:px-24 pt-10 lg:pt-24 pb-44 mx-auto">
				<ChapterInfo
					chapterName="자료구조"
					chapterInfoText="배열, 연결리스트, 스택, 등 기본적인 자료구조의 개념과 구현을
									학습하는 챕터입니다"
					showActionButtons
				/>
				<div className="grid grid-rows-[auto_auto] grid-cols-2 gap-x-4  sm:gap-x-5  lg:gap-x-7  xl:gap-x-16 gap-y-14">
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
							<button
								type="button"
								className="font-medium text-xl text-gray-700 flex items-center cursor-pointer"
							>
								문제 풀러 가기
								<NextIcon className="w-5" />
							</button>
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
							<button
								type="button"
								className="font-medium text-xl text-gray-700 flex items-center cursor-pointer"
							>
								문제 풀러 가기
								<NextIcon className="w-5" />
							</button>
						</div>
					</section>
					{[1, 2].map((item) => (
						<section key={item} className="w-full flex flex-col gap-4">
							<div className="flex items-center gap-6">
								<h3 className="text-white text-2xl font-semibold">
									문제 리스트
								</h3>
								<NextIcon className="w-6 text-white" />
							</div>
							<ol className="w-full flex flex-col gap-4">
								<li className="w-full p-5 flex flex-col gap-8 border rounded-lg border-[#531FAD] bg-[linear-gradient(109deg,rgba(36,0,49,0.80)_0%,rgba(36,0,49,0.20)_100%)] shadow-md backdrop-blur-sm">
									<div className="flex items-center">
										<h4 className="inline-block text-white font-bold text-2xl">
											Lesson01
										</h4>

										<div className="h-4.5 border-l-2  border-white mx-3" />

										<span className="text-white font-medium text-xl">
											학습 완료
										</span>
									</div>
									<span className="text-xl font-medium text-[rgba(255,255,255,0.8)]">
										10문제
									</span>
								</li>
								<li className="w-full p-5 flex flex-col gap-8 rounded-lg border border-[#8B69FF] bg-[linear-gradient(109deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.10)_100%)] shadow-[0_0_4px_-25px_rgba(0,0,0,0.25)] backdrop-blur-[5px]">
									<div className="flex items-center">
										<h4 className="inline-block text-white font-bold text-2xl">
											Lesson01
										</h4>

										<div className="h-4.5 border-l-2  border-white mx-3" />

										<span className="text-white font-medium text-xl">
											학습 완료
										</span>
									</div>
									<span className="text-xl font-medium text-[rgba(255,255,255,0.8)]">
										10문제
									</span>
								</li>

								<li className="w-full p-5 flex flex-col gap-8 border-1 rounded-lg border-[#531FAD] bg-[linear-gradient(109deg,rgba(36,0,49,0.80)_0%,rgba(36,0,49,0.20)_100%)] shadow-[0_0_4px_-25px_rgba(0,0,0,0.25)] backdrop-blur-sm">
									<div className="flex items-center">
										<h4 className="inline-block text-white font-bold text-2xl">
											Lesson01
										</h4>

										<div className="h-4.5 border-l-2  border-white mx-3" />

										<span className="text-white font-medium text-xl">
											학습 완료
										</span>
									</div>
									<span className="text-xl font-medium text-[rgba(255,255,255,0.8)]">
										10문제
									</span>
								</li>

								<li className="w-full p-5 flex flex-col gap-8 border-1 rounded-lg border-[#531FAD] bg-[linear-gradient(109deg,rgba(36,0,49,0.80)_0%,rgba(36,0,49,0.20)_100%)] shadow-[0_0_4px_-25px_rgba(0,0,0,0.25)] backdrop-blur-sm">
									<div className="flex items-center">
										<h4 className="inline-block text-white font-bold text-2xl">
											Lesson01
										</h4>

										<div className="h-4.5 border-l-2  border-white mx-3" />

										<span className="text-white font-medium text-xl">
											학습 완료
										</span>
									</div>
									<span className="text-xl font-medium text-[rgba(255,255,255,0.8)]">
										10문제
									</span>
								</li>
							</ol>
						</section>
					))}
				</div>
			</main>
		</BackgroundLayout>
	);
}
