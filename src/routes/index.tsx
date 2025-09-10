import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createFileRoute } from "@tanstack/react-router";
import useCountStore from "./../store.tsx";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { count, increment, decrement } = useCountStore();

	return (
		<>
			<ReactQueryDevtools initialIsOpen={false} />
			<div className="bg-bronze font-pretendard">브론즈</div>
			<div className="bg-silver font-pretendard">실버</div>
			<div className="bg-gold font-mbc">골드</div>
			<div className="bg-platinum">플래티넘</div>
			<div className="bg-diamond">다이아몬드</div>
			<div className="bg-black rounded-lg p-5 flex flex-col items-center text-white">
				<p className="font-mbc text-lg">{count}</p>
				<div className="flex gap-4 bg-gray-500 px-5 py-2 rounded-lg">
					<button
						type="button"
						className="bg-diamond px-2 rounded-full"
						onClick={increment}
					>
						+
					</button>
					<button
						type="button"
						className="bg-diamond px-2 rounded-full"
						onClick={decrement}
					>
						-
					</button>
				</div>
			</div>
		</>
	);
}
