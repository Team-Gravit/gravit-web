import type { ReactNode } from 'react';

import LearningStreakBody from '@/entities/learning/ui/learning-streak-body';
import {
  useGetLearning,
  useGetWeeklyRecord,
} from '@/shared/api/@generated/mainpage-api/mainpage-api';
import Card from '@/shared/ui/card/card';

import { toStreakViewModel } from './model';
import SectionCard from './ui/section-card';
import SectionStatus from './ui/section-status';

/**
 * loading/error/empty/success 본문이 공유하는 최소 높이.
 * 상태 전환 시 카드 높이가 흔들리지 않도록 예약하는 공간 계약입니다.
 * (숫자 1줄 + 주간 뱃지 1줄의 자연 높이에 맞춘 값)
 */
const STREAK_BODY_MIN_HEIGHT = 'min-h-20 md:min-h-[88px]';

/**
 * 학습 기록(연속 학습일) 섹션.
 *
 * 하나의 SectionCard(헤더 고정) 안에서 본문만 loading/error/empty/success로 교체하여
 * 상태 전환 시 레이아웃 시프트가 없도록 합니다.
 *
 * TODO: 주간 기록과 학습 상세를 함께 조회 중. API 설계 수정 요청 상태이며 변경되면 정리 예정.
 */
export default function StreakSection() {
  const weeklyRecord = useGetWeeklyRecord();
  const learning = useGetLearning();

  const handleRetry = () => {
    if (weeklyRecord.isError) void weeklyRecord.refetch();
    if (learning.isError) void learning.refetch();
  };

  let body: ReactNode;
  if (weeklyRecord.isError || learning.isError) {
    body = (
      <SectionStatus
        className={STREAK_BODY_MIN_HEIGHT}
        message="학습 기록을 불러오지 못했어요."
        action={
          <button
            type="button"
            className="text-main underline text-body1-normal"
            onClick={handleRetry}
          >
            다시 시도
          </button>
        }
      />
    );
  } else if (weeklyRecord.isPending || learning.isPending) {
    body = <LearningStreakBody isLoading />;
  } else if (!weeklyRecord.data || !learning.data) {
    body = (
      <SectionStatus
        className={STREAK_BODY_MIN_HEIGHT}
        message="아직 학습 기록이 없어요."
        action={<Card.Link to="/learning">학습 시작하기</Card.Link>}
      />
    );
  } else {
    body = <LearningStreakBody {...toStreakViewModel(weeklyRecord.data, learning.data)} />;
  }

  return (
    <SectionCard
      title="연속 학습일"
      action={<Card.Link to="/league">자세히 보기</Card.Link>}
      className="gap-[5px] md:gap-4"
    >
      {body}
    </SectionCard>
  );
}
