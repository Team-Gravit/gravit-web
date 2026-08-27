import TierBadge from '@/entities/league/ui/tier-badge';
import Profile from '@/entities/user/ui/profile';
import Card from '@/shared/ui/card/card';
import ProgressBar from '@/shared/ui/progress-bar/progress-bar';
import { ProgressCard } from '@/shared/ui/progress-card/progress-card';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

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
      <div className="flex min-w-0 items-center gap-2 text-text-1 text-heading2">
        <Profile profileImgId={user.profileImgId} size="xs" />
        <span className="truncate">{user.nickname}</span>
        <span className="shrink-0">LV {user.level}</span>
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

/**
 * 하나의 진행 카드(레벨/티어) 로딩 표현. 아바타·라벨·수치·게이지 트랙 형태를 유지합니다.
 */
const ProgressCardSkeleton = () => (
  <div className="flex flex-1 flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" className="size-8 shrink-0" />
        <Skeleton variant="text" width={72} textSize="heading2" />
      </div>
      <Skeleton variant="text" width={64} textSize="body1Normal" />
    </div>
    <ProgressBar value={0} />
  </div>
);

type UserProgressBarProps = {
  user?: {
    nickname: string;
    level: number;
    currentXp: number;
    maxXp: number;
    profileImgNumber: number;
  };
  rank?: {
    leagueId: number;
    leagueName: string;
    currentLP: number;
    maxLP: number;
  };
  isLoading?: boolean;
};

export default function UserProgressBar({ user, rank, isLoading = false }: UserProgressBarProps) {
  return (
    <Card className="flex flex-row items-center gap-4">
      {isLoading || !user ? (
        <ProgressCardSkeleton />
      ) : (
        <LevelCard
          user={{
            profileImgId: user.profileImgNumber,
            nickname: user.nickname,
            level: user.level,
            xp: user.currentXp,
            maxXp: user.maxXp,
          }}
        />
      )}
      <div className="w-px self-stretch bg-divider-1" />
      {isLoading || !rank ? (
        <ProgressCardSkeleton />
      ) : (
        <TierCard
          rank={{
            tier: rank.leagueId,
            tierLabel: rank.leagueName,
            lp: rank.currentLP,
            maxLp: rank.maxLP,
          }}
        />
      )}
    </Card>
  );
}
