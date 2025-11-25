import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import Banner from "@/shared/ui/banner/Banner";
import TierSelector from "@/features/league/TierSelector";
import UserRankList from "@/entities/league/ui/UserRankList";
import UserLeagueInfo from "@/widgets/user/ui/UserLeagueInfo";
import { tiers } from "@/shared/lib/tiers";
import { useUserLeagues } from "@/entities/league/api/getUserLeagues";
import { useTierLeagues } from "@/entities/league/api/getTierLeagues";
import { useLeagueInfo } from "@/entities/league/api/getUserLeagueInfo";
import { useSeasonInfo } from "@/entities/league/api/getSeasonInfo";
import SeasonEndModal from "@/features/league/SeasonEndModal";
import WaitingTab from "@/entities/league/ui/WaitingTab";
import { getNextMonday, getRemainingTime } from "@/shared/lib/date";
import Timer from "@/shared/assets/icons/timer.svg?react";

export const Route = createFileRoute("/_authenticated/_fixed-header-layout/league")({
	component: RouteComponent,
});

export default function RouteComponent() {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);

	const leagueInfoQuery = useLeagueInfo();
	const seasonInfoQuery = useSeasonInfo();

	const [selectedTierId, setSelectedTierId] = useState<number>(1);
	const [showWaitingTab, setShowWaitingTab] = useState(false);
	const [modalChecked, setModalChecked] = useState(false);
	const [remainingTime, setRemainingTime] = useState("00:00:00");

	const usersQuery = useUserLeagues();
	const tierUsersQuery = useTierLeagues(selectedTierId);
	const isMainTier = leagueInfoQuery.data?.leagueId === selectedTierId;
	const usersData = isMainTier ? usersQuery : tierUsersQuery;

	useEffect(() => {
		if (leagueInfoQuery.data) {
			setSelectedTierId(leagueInfoQuery.data.leagueId);
		}
	}, [leagueInfoQuery.data]);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			if (
				container.scrollTop + container.clientHeight >=
					container.scrollHeight - 50 &&
				usersData.hasNextPage &&
				!usersData.isFetchingNextPage
			) {
				usersData.fetchNextPage();
			}
		}

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [usersData]);

	useEffect(() => {
		if (!seasonInfoQuery.data) return;

		const seasonEnd = getNextMonday().getTime();
		const TEN_MINUTES = 10 * 60 * 1000;
		const now = Date.now();
		const remaining = seasonEnd + TEN_MINUTES - now;

		if (seasonInfoQuery.data.containsPopup) {
			setShowWaitingTab(remaining > 0);
		}

		const updateRemaining = () => setRemainingTime(getRemainingTime(seasonEnd));
		updateRemaining();
		const interval = setInterval(updateRemaining, 1000);

		let timeout: NodeJS.Timeout | null = null;
		if (remaining > 0) {
			timeout = setTimeout(() => setShowWaitingTab(false), remaining);
		}

		return () => {
			clearInterval(interval);
			if (timeout) clearTimeout(timeout);
		}
	}, [seasonInfoQuery.data]);

	if (leagueInfoQuery.isFetching || seasonInfoQuery.isLoading)
		return <div>로딩중</div>;
	if (leagueInfoQuery.isError || seasonInfoQuery.isError)
		return <div>에러 발생</div>;
	if (!leagueInfoQuery.data || !seasonInfoQuery.data)
		return <div>데이터 없음</div>;

	const { nickname, xp, leagueName, level } = leagueInfoQuery.data;
	const users = usersData.data?.pages.flatMap((p) => p.contents) ?? [];
	const isLoading = usersData.isFetchingNextPage;
	const seasonInfo = seasonInfoQuery.data;

	const handleModalConfirm = () => {
		setModalChecked(true);
		const seasonEnd = getNextMonday().getTime();
		const TEN_MINUTES = 10 * 60 * 1000;
		setShowWaitingTab(Date.now() < seasonEnd + TEN_MINUTES);
	}

	return (
		<div className="w-full h-full flex flex-col relative">
			<Banner />

			{showWaitingTab &&
				!(
					seasonInfo.containsPopup &&
					seasonInfo.lastSeasonPopupDto &&
					!modalChecked
				) && (
					<div className="absolute top-28 w-full max-w-4xl bg-white rounded-4xl py-14 text-center z-40 left-1/2 transform -translate-x-1/2 flex flex-col gap-6">
						<h2 className="font-mbc text-5xl font-medium text-[#8A00B8] text-shadow-lg">
							{seasonInfo.currentSeason.nowSeason || "지난 시즌"} 종료
						</h2>
						<p className="text-[#6D6D6D] text-3xl font-semibold">
							시즌 정보를 집계 중이에요!
						</p>
					</div>
				)}
			{seasonInfo.containsPopup &&
			seasonInfo.lastSeasonPopupDto &&
			!modalChecked ? (
				<div className="flex-grow flex items-center justify-center bg-[#f2f2f2] px-40 py-20">
					<SeasonEndModal
						popup={seasonInfo.lastSeasonPopupDto}
						onConfirm={handleModalConfirm}
					/>
				</div>
			) : showWaitingTab ? (
				<div className="flex w-full items-center justify-center bg-[#f2f2f2] px-4 py-6">
					<WaitingTab
						leagueInfo={{
							nickname,
							leagueName,
							xp,
							level,
							leagueId: selectedTierId,
						}}
						selectedTierId={selectedTierId}
					/>
				</div>
			) : (
				<div className="flex-grow py-20 bg-[#f2f2f2] flex lg:flex-row flex-col gap-5.5">
					<section className="flex flex-col gap-4 lg:w-1/2 w-full min-w-0 px-10">
						<div className="flex flex-col items-center gap-4">
							<h1 className="font-mbc text-[44px] font-normal text-[#8A00B8] text-center drop-shadow-sm">
								{seasonInfo.currentSeason.nowSeason}
							</h1>
							<div className="flex flex-row py-3 px-5 w-[345px] items-center justify-center gap-6 rounded-[140px] bg-white">
								<Timer className="w-10 h-10" />
								<span className="font-mbc font-bold text-[27px] text-[#222222CC] whitespace-pre">
									{remainingTime}
								</span>
							</div>
						</div>

						<TierSelector
							tiers={tiers}
							selectedTierId={selectedTierId}
							onSelectTier={setSelectedTierId}
						/>
						<UserLeagueInfo
							nickname={nickname}
							league={leagueName}
							xp={xp}
							level={level}
						/>
					</section>

					<section
						ref={scrollContainerRef}
						style={{ height: 700, overflowY: "auto" }}
						className="lg:w-1/2 w-full flex flex-col items-center gap-8 lg:pl-6 lg:pr-32 px-5 lg:px-0"
					>
						<UserRankList users={users} loading={isLoading} />
						{!usersData.hasNextPage && (
							<p className="text-gray-500">더 이상 유저가 없습니다.</p>
						)}
					</section>
				</div>
			)}
		</div>
	)
}
