import { Link } from "@tanstack/react-router";

export default function UnitPopover({
	unitId,
	name,
	chapterId,
}: {
	unitId: string;
	chapterId: string;
	name: string;
}) {
	return (
		<div className="absolute transform top-full left-1/2 -translate-x-1/2 translate-y-3 z-[100]">
			{/* 툴팁 꼬리 */}
			<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-[#FFB608] border-l border-t border-transparent rotate-45 z-40" />
			{/* 툴팁 몸통 */}
			<div className="bg-[#FFB608] flex flex-col p-4 w-[371px] h-[130px] rounded-2xl justify-between z-50">
				<h2 className="text-2xl font-bold text-white text-start">{`${name}: ${unitId}챕터`}</h2>
				<Link
					to={`/learn/$chapterId/$unitId`}
					params={{ chapterId, unitId }}
					className="h-[54px] bg-white text-xl font-semibold text-[#222124] rounded-2xl flex items-center justify-center"
					// state={{
					// 	name: name,
					// }}
				>
					학습 시작하기 (+{50}xp)
				</Link>
			</div>
		</div>
	);
}
