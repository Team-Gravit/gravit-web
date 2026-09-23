import { useNavigate } from '@tanstack/react-router';

import { TopChapters } from '@/widgets/top-chapters';
import { WeakConcepts } from '@/widgets/weak-concepts';
import { WeeklyReport } from '@/widgets/weekly-report';

/**
 * 마이페이지 학습 탭. 이번주 리포트·많이 푼 챕터를 2컬럼(모바일 1컬럼)으로,
 * 취약 개념을 전체 폭으로 배치한다. 데이터가 없는 카드는 "학습하러 가기"로 학습 화면에 보낸다.
 */
export function LearningTab() {
  const navigate = useNavigate();
  const goToLearning = () => navigate({ to: '/learning' });
  const goToUnit = (unitId: number) =>
    navigate({ to: '/learning/units/$unitId', params: { unitId: String(unitId) } });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <WeeklyReport />
        <TopChapters onGoToLearning={goToLearning} />
      </div>
      <WeakConcepts onGoToLearning={goToLearning} onSelectConcept={goToUnit} />
    </div>
  );
}
