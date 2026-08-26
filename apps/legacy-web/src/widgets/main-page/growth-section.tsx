import { useGetLeague, useGetProfile } from '@/shared/api/@generated/mainpage-api/mainpage-api';

import { toLeagueViewModel, toProfileViewModel } from './model';
import MainSectionError from './ui/main-section-error';
import UserProgressBar from './user-progress-bar';

/**
 * 성장 현황 섹션. 프로필과 리그를 함께 조회해 하나의 로딩/에러 단위로 묶습니다.
 * - 로딩: 카드 형태를 유지한 채 데이터 영역만 스켈레톤(카드에 위임)
 * - 에러: 카드 전체를 재시도 UI로 대체
 */
export default function GrowthSection() {
  const profile = useGetProfile();
  const league = useGetLeague();

  if (profile.isError || league.isError) {
    return (
      <MainSectionError
        label="성장 현황"
        onRetry={() => {
          if (profile.isError) void profile.refetch();
          if (league.isError) void league.refetch();
        }}
      />
    );
  }

  if (profile.isPending || league.isPending) {
    return <UserProgressBar isLoading />;
  }

  if (!profile.data || !league.data) return null;

  return (
    <UserProgressBar
      user={toProfileViewModel(profile.data)}
      rank={toLeagueViewModel(league.data)}
    />
  );
}
