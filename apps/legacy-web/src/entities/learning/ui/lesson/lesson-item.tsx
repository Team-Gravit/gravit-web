import { Link } from '@tanstack/react-router';

import Chip from '@/shared/ui/chip/chip';

interface LessonItemProps {
  chapterId: string;
  unitId: string;
  lessonId: string;
  lessonTitle: string;
  isSolved: boolean;
  totalProblem: number;
}

function LessonItem({
  chapterId,
  unitId,
  lessonId,
  lessonTitle,
  isSolved,
  totalProblem,
}: LessonItemProps) {
  return (
    <Link
      to="/learning/$chapterId/$unitId/$lessonId"
      params={{ chapterId, lessonId, unitId }}
      className="flex justify-between items-center px-4 py-3 rounded-lg bg-bg-2 md:bg-bg-1"
    >
      <div className="flex flex-col gap-0.5 md:gap-1">
        <h4 className="text-label1 md:text-heading2 text-text-2">{lessonTitle}</h4>
        <p className="text-label2 md:text-label1 text-text-4">{`${totalProblem}문제`}</p>
      </div>

      <Chip size="sm" variant={isSolved ? 'filled' : 'muted'}>
        {isSolved ? '학습 완료' : '학습 전'}
      </Chip>
    </Link>
  );
}

export default LessonItem;
