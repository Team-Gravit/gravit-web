import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import WaitingTab from "@/entities/league/ui/WaitingTab";
import Banner from "@/shared/ui/banner/Banner";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/test",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const [showWaitingTab] = useState(true); // WaitingTab 활성화 여부

	const dummyLeagueInfo = {
		nickname: "테스트유저",
		leagueName: "브론즈 1",
		xp: 1234,
		level: 5,
		leagueId: 1, // 브론즈 1 아이콘 선택
	};

	const selectedTierId = dummyLeagueInfo.leagueId;

	return (
		<div className="w-full min-h-screen bg-[#f2f2f2] flex flex-col items-center relative">
			{/* Banner */}
			<Banner />

			{/* WaitingTab 전용 안내 박스 (Banner 위에 겹치기) */}
			{showWaitingTab && (
				<div className="absolute top-48 w-full max-w-3xl bg-white rounded-lg shadow-md p-4 text-center z-40">
					<h2 className="text-xl font-bold text-purple-700">
						지난 시즌 기록을 확인하세요!
					</h2>
					<p className="text-gray-600">
						지난 시즌의 내 리그와 기록을 확인할 수 있습니다.
					</p>
				</div>
			)}

			{/* WaitingTab 화면 */}
			{showWaitingTab && (
				<div className="flex-grow w-full flex items-center justify-center px-4 py-6">
					<WaitingTab
						leagueInfo={dummyLeagueInfo}
						selectedTierId={selectedTierId}
					/>
				</div>
			)}
		</div>
	);
}
