import { cn } from "@/shared/lib/cn";
import { Link } from "@tanstack/react-router";
import LockIcon from "@/shared/assets/icons/lock.svg?react";

export default function UnitPopover({
	unitId,
	lessonName,
	lessonId,
	isActive,
}: {
	unitId: string;
	lessonName: string;
	lessonId: string;
	isActive: boolean;
}) {
	return (
		<div
			className={cn(
				"absolute transform top-full left-1/2 -translate-x-1/2 z-[100]",
				isActive ? "translate-y-7" : "translate-y-3",
			)}
		>
			{/* 툴팁 꼬리 */}
			<div
				className={cn(
					"absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4  border-l border-t border-transparent rotate-45 z-40",
					isActive ? "bg-[#FFB608]" : "bg-gray-500",
				)}
			/>
			{/* 툴팁 몸통 */}
			<div
				className={cn(
					"flex flex-col p-4 w-[371px] h-[130px] rounded-2xl justify-between z-50",
					isActive ? "bg-[#FFB608]" : "bg-gray-500",
				)}
			>
				<h2 className="text-2xl font-bold text-white text-start">{`${lessonName}: ${unitId}유닛`}</h2>
				{isActive ? (
					<Link
						to={"/lesson/$lessonId"}
						params={{ lessonId }}
						className="h-[54px] bg-white text-xl font-semibold text-[#222124] rounded-2xl flex items-center justify-center"
					>
						학습 시작하기 (+20xp)
					</Link>
				) : (
					<div className="h-[54px] bg-white text-xl font-semibold text-[#222124] rounded-2xl flex items-center justify-center">
						<LockIcon />
					</div>
				)}
			</div>
		</div>
	);
}
