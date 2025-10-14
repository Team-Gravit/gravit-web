import LearningProgressInfo from "@/widgets/learning-widget/LearningProgressInfo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Mascot from "@/shared/assets/icons/end-mascot.svg?react";
import { StatCard } from "@/shared/ui/card/StatCard";
import bookImg from "@/shared/assets/images/books.png";
import playImg from "@/shared/assets/images/play.png";
import formatTime from "@/widgets/learning-widget/lib/formatTime";
import { useQuizStateStore } from "@/features/quiz/model/store";
import { useFetchMainInfo } from "@/widgets/main/model/hooks";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/lesson/result",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const {
		data: currentUserData,
		isFetching,
		isError,
		error,
	} = useFetchMainInfo();
	const latestQuizResult = useQuizStateStore((state) => state.latestQuizResult);

	if (!latestQuizResult) {
		navigate({ to: "/learn" });
		return;
	}

	if (isFetching) {
		return <div>로딩중</div>;
	}
	if (isError) {
		return <div>에러</div>;
	}

	if (!currentUserData) {
		return <div>{error}</div>;
	}

	return (
		<main className="flex-grow flex flex-col items-center bg-gray-200 px-[146px] pt-[65px] pb-[88px]">
			<div className="max-w-[1148px] w-full h-full flex flex-col gap-10 transition-all duration-500 ease-in-out">
				<LearningProgressInfo
					xp={latestQuizResult.xp}
					league={latestQuizResult.leagueName}
					level={latestQuizResult.currentLevel}
				/>
				<section className="w-full flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-10">
					<div className="flex flex-col items-center">
						<h2 className="text-neutral-100 text-3xl lg:text-4xl font-semibold mb-4">
							{currentUserData?.chapterId + 1}에 한발 더 가까워졌어요!
						</h2>
						<p className="text-gray-600 text-2xl lg:text-3xl font-normal">
							{currentUserData?.chapterName}의 {currentUserData.completedUnits}
							번째 단계를 학습을 완료했어요
						</p>
						<Mascot className="w-[250px] lg:w-[300px] lg:mt-5" />
					</div>
					<div className="flex flex-col gap-4 flex-grow lg:max-w-[470px]">
						<StatCard
							icon={bookImg}
							label={"정답률"}
							value={`${String(latestQuizResult.accuracy)}%`}
							size="lg"
						/>
						<StatCard
							icon={playImg}
							label={"풀이시간"}
							value={formatTime(latestQuizResult.timeElapsed)}
							size="lg"
						/>
					</div>
				</section>
				<section className="w-full h-[60px] lg:h-[80px] grid grid-cols-2 gap-6">
					<Link
						to={"/main"}
						className="gray-btn cursor-pointer text-2xl lg:text-3xl font-semibold flex items-center justify-center"
					>
						메인으로 가기
					</Link>
					<Link
						to={"/learn/$chapterId"}
						params={{ chapterId: currentUserData.chapterId.toString() }}
						className="primary-btn cursor-pointer text-2xl lg:text-3xl font-semibold flex items-center justify-center"
					>
						계속하기
					</Link>
				</section>
			</div>
		</main>
	);
}
