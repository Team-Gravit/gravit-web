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

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/league",
)({
	component: LeaguePage,
});

export default function LeaguePage() {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [selectedTierId, setSelectedTierId] = useState<number>(1);
	const [showWaitingTab, setShowWaitingTab] = useState(true);
	const [modalChecked, setModalChecked] = useState(false);
	const [remainingTime, setRemainingTime] = useState("00:00:00");

	const leagueInfoQuery = useUserLeagueProfile();
	const seasonInfoQuery = useSeasonInfo();
	const selectedTierLeagueQuery = useLeagueInfo(selectedTierId);

	const usersQuery = useUserLeagueRanking();
	const tierUsersQuery = useLeagueRanking(selectedTierId);

	const isMainTier = leagueInfoQuery.data?.leagueId === selectedTierId;
	const usersData = isMainTier ? usersQuery : tierUsersQuery;

	/* ==============================
      시즌 남은 시간
  ============================== */
	useEffect(() => {
		if (!seasonInfoQuery.data) return;

		const seasonEnd = getNextMonday().getTime();
		const updateRemaining = () => setRemainingTime(getRemainingTime(seasonEnd));

		updateRemaining();
		const interval = setInterval(updateRemaining, 1000);
		return () => clearInterval(interval);
	}, [seasonInfoQuery.data]);

	/* ==============================
      대기 탭 체크
  ============================== */
	useEffect(() => {
		const checkWaitingTab = () => {
			const now = new Date();
			if (now.getDay() === 1 && now.getHours() === 0 && now.getMinutes() < 5) {
				setShowWaitingTab(true);
			} else {
				setShowWaitingTab(false);
			}
		};

		checkWaitingTab();
		const interval = setInterval(checkWaitingTab, 1000);
		return () => clearInterval(interval);
	}, []);

	/* ==============================
      무한 스크롤 (핵심)
  ============================== */
	useEffect(() => {
		const rootEl = scrollContainerRef.current;
		const targetEl = bottomRef.current;

		if (!rootEl || !targetEl) return;
		if (!usersData.hasNextPage) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (
					entry.isIntersecting &&
					usersData.hasNextPage &&
					!usersData.isFetchingNextPage
				) {
					usersData.fetchNextPage();
				}
			},
			{
				root: rootEl,
				threshold: 1.0,
			},
		);

		observer.observe(targetEl);
		return () => observer.disconnect();
	}, [
		usersData.hasNextPage,
		usersData.isFetchingNextPage,
		usersData.fetchNextPage,
	]);

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

	const showContent =
		!showWaitingTab &&
		!(
			seasonInfo.containsPopup &&
			seasonInfo.lastSeasonPopupDto &&
			!modalChecked
		);

	return (
		<div
			className="w-screen min-h-screen flex flex-col bg-no-repeat bg-top bg-cover mt-[var(--header-height)]"
			style={{ backgroundImage: `url(${BackgroundImage})` }}
		>
			{showWaitingTab && (
				<div className="flex flex-row w-full h-full items-center justify-center py-17">
					<WaitingTab />
				</div>
			)}

			{seasonInfo.containsPopup &&
				seasonInfo.lastSeasonPopupDto &&
				!modalChecked && (
					<div className="absolute inset-0 flex items-center justify-center z-50">
						<SeasonEndModal
							popup={seasonInfo.lastSeasonPopupDto}
							onConfirm={() => setModalChecked(true)}
						/>
					</div>
				)}

			{showContent && (
				<div className="flex-grow py-20 flex lg:flex-row flex-col gap-5.5">
					{/* 좌측 */}
					<section className="flex flex-col gap-4 lg:w-1/2 w-full min-w-0 px-10">
						<div className="flex flex-col items-center gap-4">
							<h1 className="font-mbc text-[64.21px] text-[#FFC1FC]">
								{seasonInfo.currentSeason.nowSeason}
							</h1>

							<div className="flex py-3 px-14 gap-6 rounded-[140px] bg-[#FFFFFF66]">
								<Timer className="w-11 h-11" />
								<span className="font-bold text-[40px] text-white">
									{remainingTime}
								</span>
							</div>
						</div>

						{selectedTierLeagueQuery.data && (
							<TierSelector
								tiers={tiers}
								selectedTierId={selectedTierId}
								onSelectTier={setSelectedTierId}
								selectedTierInfo={mapToLeagueInfo(selectedTierLeagueQuery.data)}
							/>
						)}
					</section>

					{/* 우측 랭킹 */}
					<section
						ref={scrollContainerRef}
						style={{ height: 750, overflowY: "auto" }}
						className="lg:w-1/2 w-full flex flex-col items-center gap-8 lg:pl-6 lg:pr-32 px-5"
					>
						<UserRankList
							users={users}
							loading={isLoading}
							highlightUserId={leagueInfoQuery.data.userId}
						/>

						{/* 무한스크롤 트리거 */}
						<div ref={bottomRef} style={{ height: 1 }} />

						{!usersData.hasNextPage && (
							<p className="text-gray-500">더 이상 유저가 없습니다.</p>
						)}
					</section>
				</div>
			)}
		</div>
	);
}
