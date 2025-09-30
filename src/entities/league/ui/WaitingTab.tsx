import TierSelector from "@/features/league/TierSelector";
import UserLeagueInfo from "@/widgets/user/ui/UserLeagueInfo";
import { tiers } from "@/shared/lib/tiers";

interface WaitingTabProps {
	leagueInfo: {
		nickname: string;
		leagueName: string;
		xp: number;
		level: number;
		leagueId: number;
	};
	selectedTierId: number;
}

export default function WaitingTab({
	leagueInfo,
	selectedTierId,
}: WaitingTabProps) {
	return (
		<div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto py-10 px-4">
			<h1 className="font-mbc text-[44px] font-normal text-[#8A00B8] text-center text-shadow-lg mb-6">
				지난 시즌
			</h1>

			<div className="pointer-events-none mb-6 w-full max-w-2xl">
				<TierSelector
					tiers={tiers}
					selectedTierId={selectedTierId}
					onSelectTier={() => {}}
				/>
			</div>

			<div className="p-6 flex flex-col gap-4 w-[700px]">
				<UserLeagueInfo
					nickname={leagueInfo.nickname}
					league={leagueInfo.leagueName}
					xp={leagueInfo.xp}
					level={leagueInfo.level}
					statusText="지난"
				/>
			</div>
		</div>
	);
}
