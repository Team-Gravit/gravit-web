import { cn } from "@/shared/lib/cn";
import { Link } from "@tanstack/react-router";

export default function StartMissionButton({
	isCompleted,
}: {
	isCompleted: boolean;
}) {
	return (
		<Link
			disabled={isCompleted}
			to="/learn"
			className={cn(
				"w-full rounded-xl px-2.5 py-5 font-semibold text-2xl text-center",
				isCompleted
					? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
					: "bg-gray-200",
			)}
		>
			도전하러 가기
		</Link>
	);
}
