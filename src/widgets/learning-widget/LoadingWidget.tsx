import { useLayoutEffect } from "react";
import LoadingSpinner from "@/shared/assets/icons/spinner.svg?react";
import { cn } from "@/shared/lib/cn";
import loadingGif from "./assets/lesson-loading.gif";

const LEARNING_TIPS = [
	{
		id: "report-problem",
		content:
			"문제가 이상이 있는 경우 우측 상단의 신고 버튼으로 접수할 수 있어요",
		category: "feature",
	},
	{
		id: "bookmark-guide",
		content:
			"북마크하고 싶은 문제가 있다면, 화면 좌측 상단에 있는 책갈피 모양 아이콘을 눌러 쉽게 북마크할 수 있어요.",
		category: "feature",
	},
	{
		id: "mascot-story",
		content:
			"마스코드 그래빗은 원래 흰색 토끼였지만, 태양풍을 맞아 노랗게 변했답니다.",
		category: "story",
	},
	{
		id: "repeat-lesson-notice",
		content:
			"같은 레슨을 반복해서 풀면, XP와 LP는 추가로 지급되지 않으니 참고해주세요.",
		category: "policy",
	},
	{
		id: "league-reset-info",
		content:
			"리그는 매주 일요일 자정에 초기화되어 새로운 순위 경쟁이 시작돼요.",
		category: "policy",
	},
] as const;

export type LearningTip = (typeof LEARNING_TIPS)[number];
export type LearningTipCategory = LearningTip["category"];

const getRandomTip = (): LearningTip => {
	const randomIndex = Math.floor(Math.random() * LEARNING_TIPS.length);
	return LEARNING_TIPS[randomIndex];
};

const preloadImages = (imageUrls: string[]): Promise<unknown[]> => {
	const promises = imageUrls.map((url) => {
		return new Promise<void>((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = reject;
			img.src = url;
		});
	});
	return Promise.all(promises);
};

export default function LoadingWidget({ className }: { className?: string }) {
	useLayoutEffect(() => {
		preloadImages([loadingGif]);
	}, []);

	return (
		<section className={cn("relative w-[350px]", className)}>
			<img src={loadingGif} alt={"로딩 gif"} className="w-[350px]" />
			<div className="absolute w-full flex flex-col items-center bottom-0">
				<LoadingSpinner
					className="animate-spin mb-2"
					style={{ animationDuration: "2s" }}
				/>
				<h3 className="text-gray-900 text-center font-semibold text-[32px] mb-4">
					로딩 중...
				</h3>

				<p className="text-[20px] text-gray-600 font-normal text-center break-keep">
					{getRandomTip().content}
				</p>
			</div>
		</section>
	);
}
