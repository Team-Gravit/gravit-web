import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import TierSelector from "@/features/league/TierSelector";
import UserRankList from "@/entities/league/ui/UserRankList";
import { tiers } from "@/shared/lib/tiers";
import { useUserLeagueRanking } from "@/entities/league/ranking/api/useUserLeagueRanking";
import { useLeagueRanking } from "@/entities/league/ranking/api/useLeagueRanking";
import { useUserLeagueProfile } from "@/entities/league/ranking/api/useUserLeagueProfile";
import { useSeasonInfo } from "@/entities/league/api/useSeasonInfo";
import { useLeagueInfo } from "@/entities/league/api/useLeagueInfo";
import SeasonEndModal from "@/features/league/SeasonEndModal";
import WaitingTab from "@/entities/league/ui/WaitingTab";
import { getNextMonday, getRemainingTime } from "@/shared/lib/date";
import Timer from "@/shared/assets/icons/timer.svg?react";
import BackgroundImage from "@/shared/assets/images/bg-dark.png";
import { mapToLeagueInfo, mapToUser } from "@/entities/league/model/mappers";
//import type { UserLeagues } from "@/entities/league/model/types";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/league",
)({
	component: LeaguePage,
});

export default function LeaguePage() {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const [selectedTierId, setSelectedTierId] = useState<number>(1);
	const [showWaitingTab, setShowWaitingTab] = useState(true); // 항상 true로 시작
	const [modalChecked, setModalChecked] = useState(false);
	const [remainingTime, setRemainingTime] = useState("00:00:00");

	const leagueInfoQuery = useUserLeagueProfile();
	const seasonInfoQuery = useSeasonInfo();
	const selectedTierLeagueQuery = useLeagueInfo(selectedTierId);

	const usersQuery = useUserLeagueRanking();
	const tierUsersQuery = useLeagueRanking(selectedTierId);
	const isMainTier = leagueInfoQuery.data?.leagueId === selectedTierId;
	const usersData = isMainTier ? usersQuery : tierUsersQuery;

	// 남은 시간 계산용 (나중에 시간 조건으로 WaitingTab 제어 가능)
	useEffect(() => {
		if (!seasonInfoQuery.data) return;
		const seasonEnd = getNextMonday().getTime();
		const updateRemaining = () => setRemainingTime(getRemainingTime(seasonEnd));
		updateRemaining();
		const interval = setInterval(updateRemaining, 1000);
		return () => clearInterval(interval);
	}, [seasonInfoQuery.data]);

	const handleModalConfirm = () => {
		setModalChecked(true);
		// 나중에 종료 후 WaitingTab 표시 제어 가능
	};

	if (leagueInfoQuery.isFetching || seasonInfoQuery.isLoading)
		return <div>로딩중</div>;
	if (leagueInfoQuery.isError || seasonInfoQuery.isError)
		return <div>에러 발생</div>;
	if (!leagueInfoQuery.data || !seasonInfoQuery.data)
		return <div>데이터 없음</div>;

	const users =
		usersData.data?.pages.flatMap((p) => p.contents.map(mapToUser)) ?? [];
	const isLoading = usersData.isFetchingNextPage;
	const seasonInfo = seasonInfoQuery.data;

	return (
		<div
			className="w-screen min-h-screen flex flex-col bg-no-repeat bg-top bg-cover relative"
			style={{ backgroundImage: `url(${BackgroundImage})` }}
		>
			{/* WaitingTab 항상 표시 */}
			{showWaitingTab && (
				<div className="absolute top-28 w-full h-full flex justify-center z-40">
					<WaitingTab />
				</div>
			)}

			{/* 시즌 종료 모달 */}
			{seasonInfo.containsPopup &&
				seasonInfo.lastSeasonPopupDto &&
				!modalChecked && (
					<div className="absolute inset-0 flex items-center justify-center z-50">
						<SeasonEndModal
							popup={seasonInfo.lastSeasonPopupDto}
							onConfirm={handleModalConfirm}
						/>
					</div>
				)}

			{/* 페이지 본문: WaitingTab이나 종료 모달이 뜨지 않을 때만 표시 */}
			{!showWaitingTab &&
				!(
					seasonInfo.containsPopup &&
					seasonInfo.lastSeasonPopupDto &&
					!modalChecked
				) && (
					<div className="flex-grow py-20 flex lg:flex-row flex-col gap-5.5">
						{/* 좌측 티어 정보 */}
						<section className="flex flex-col gap-4 lg:w-1/2 w-full min-w-0 px-10">
							<div className="flex flex-col items-center gap-4">
								<h1 className="font-mbc text-[64.21px] font-normal text-[#FFC1FC] text-center drop-shadow-sm">
									{seasonInfo.currentSeason.nowSeason}
								</h1>
								<div className="flex flex-row py-3 px-14 max-w-[512px] items-center justify-center gap-6 rounded-[140px] bg-[#FFFFFF66]">
									<Timer className="w-11 h-11 font-mbc" />
									<span className="font-bold text-[40px] text-white whitespace-pre">
										{remainingTime}
									</span>
								</div>
							</div>
							{selectedTierLeagueQuery.data && (
								<TierSelector
									tiers={tiers}
									selectedTierId={selectedTierId}
									onSelectTier={setSelectedTierId}
									selectedTierInfo={mapToLeagueInfo(
										selectedTierLeagueQuery.data,
									)}
								/>
							)}
						</section>

						{/* 우측 유저 랭킹 */}
						<section
							ref={scrollContainerRef}
							style={{ height: 750, overflowY: "auto" }}
							className="lg:w-1/2 w-full h-full flex flex-col items-center gap-8 lg:pl-6 lg:pr-32 px-5 lg:px-0"
						>
							<UserRankList
								users={users}
								loading={isLoading}
								highlightUserId={leagueInfoQuery.data?.userId}
							/>
							{!usersData.hasNextPage && (
								<p className="text-gray-500">더 이상 유저가 없습니다.</p>
							)}
						</section>
					</div>
				)}
		</div>
	);
}
