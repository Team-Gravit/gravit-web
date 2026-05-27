import TierBadge from "@/entities/league/ui/tier-badge";
import Profile from "@/entities/user/ui/profile";
import Card from "@/shared/ui/card/card";
import { ProgressCard } from "@/shared/ui/progress-card/progress-card";

export const LevelCard = ({
	user,
}: {
	user: {
		profileImgId: number;
		nickname: string;
		level: number;
		xp: number;
		maxXp: number;
	};
}) => (
	<ProgressCard
		className="flex-1"
		leftSlot={
			<div className="flex items-center gap-2 text-text-1 text-heading2">
				<Profile profileImgId={user.profileImgId} size="xs" />
				<span>{user.nickname}</span>
				<span>LV {user.level}</span>
			</div>
		}
		value={user.xp}
		max={user.maxXp}
		unit="XP"
	/>
);

export const TierCard = ({
	rank,
}: {
	rank: { tier: number; tierLabel: string; lp: number; maxLp: number };
}) => (
	<ProgressCard
		className="flex-1 text-text-1 text-heading2"
		leftSlot={<TierBadge tier={rank.tier} />}
		value={rank.lp}
		max={rank.maxLp}
		unit="LP"
	/>
);

type UserProgressBarProps = {
	user: {
		nickname: string;
		level: number;
		currentXp: number;
		maxXp: number;
		profileImgNumber: number;
	};
	rank: {
		leagueId: number;
		leagueName: string;
		currentLP: number;
		maxLP: number;
	};
};

export default function UserProgressBar({ user, rank }: UserProgressBarProps) {
	return (
		<Card className="flex flex-row items-center gap-4">
			<LevelCard
				user={{
					profileImgId: user.profileImgNumber,
					nickname: user.nickname,
					level: user.level,
					xp: user.currentXp,
					maxXp: user.maxXp,
				}}
			/>
			<div className="w-[1px] h-full bg-gray-300" />
			<TierCard
				rank={{
					tier: rank.leagueId,
					tierLabel: rank.leagueName,
					lp: rank.currentLP,
					maxLp: rank.maxLP,
				}}
			/>
		</Card>
	);
}
