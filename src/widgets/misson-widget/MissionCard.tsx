import StartMissionButton from "@/features/mission/StartMissionButton";
import Card from "@/shared/ui/card/Card";

export default function MissionCard() {
	return (
		<Card className=" h-full w-2/3 min-h-[334px] flex flex-col justify-between p-4 ">
			<div className="flex flex-col gap-3">
				<h3 className="font-semibold text-[32px] leading-none">
					오늘의 미션🔥
				</h3>
				<hr className="text-gray-500 border-dashed border-2" />
				<ul className="flex list-disc pl-5 leading-none">
					<li className="text-2xl font-medium">
						자료구조 챕터3 완료
						<small className="block text-base text-gray-800 font-normal mt-1">
							완료 시 150XP
						</small>
					</li>
				</ul>
			</div>
			<StartMissionButton />
		</Card>
	);
}
