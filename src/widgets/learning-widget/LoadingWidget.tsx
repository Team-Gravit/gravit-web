import LoadingSpinner from "@/shared/assets/icons/spinner.svg?react";
import loadingGif from "./assets/lesson-loading.gif";
import { cn } from "@/shared/lib/cn";
import { useLayoutEffect } from "react";

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
			<img src={loadingGif} alt={"로딩 gif"} className="w-full" />
			<div className="absolute w-full flex flex-col items-center bottom-0 -translate-y-[27px]">
				<LoadingSpinner
					className="animate-spin mb-2"
					style={{ animationDuration: "2s" }}
				/>
				<h3 className="text-gray-900 text-center font-semibold text-[32px] mb-4">
					로딩 중...
				</h3>

				<p className="text-[20px] text-gray-600 font-normal">
					시즌은 매주 월요일 자정에 초기화돼요.
				</p>
			</div>
		</section>
	);
}
