import MissionCard from '@/entities/mission/mission-card';
import { useGetMission } from '@/shared/api/@generated/mainpage-api/mainpage-api';

import { toMissionViewModel } from './model';
import MainSectionError from './ui/main-section-error';

/**
 * 오늘의 미션 섹션
 * - 로딩: 카드 껍데기(타이틀)는 유지하고 데이터 영역만 스켈레톤(카드에 위임)
 * - 에러: 카드 전체를 재시도 UI로 대체
 */
export default function MissionSection({ className }: { className?: string }) {
  const { data, isError, isPending, refetch } = useGetMission();

  if (isError) {
    return (
      <MainSectionError className={className} label="오늘의 미션" onRetry={() => void refetch()} />
    );
  }

  if (isPending) {
    return <MissionCard className={className} isLoading />;
  }

  if (!data) return null;

  return <MissionCard className={className} missionDetail={toMissionViewModel(data)} />;
}
