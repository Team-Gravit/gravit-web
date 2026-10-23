import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import type { InterviewSessionSummaryResponse } from '@/entities/interview';

export interface ReportWeakTopicsCardProps {
  weakTopics: InterviewSessionSummaryResponse['weakTopics'];
  layout: 'wide' | 'narrow';
}

/** 절반 이하 점수를 받은 문항의 유닛. 학습 콘텐츠로 바로 이동한다. */
export function ReportWeakTopicsCard({ weakTopics, layout }: ReportWeakTopicsCardProps) {
  const isWide = layout === 'wide';

  return (
    <Card className="gap-4 p-4 md:p-8">
      <CardHeader>
        <CardTitle>약점 분야</CardTitle>
      </CardHeader>
      <ul
        className={cn(
          'gap-3',
          isWide ? 'grid grid-cols-2 lg:grid-cols-3' : 'flex flex-col sm:grid sm:grid-cols-2',
        )}
      >
        {weakTopics.map((weakTopic) => (
          <li
            key={weakTopic.unitId}
            className={cn(
              'flex flex-col justify-between bg-bg-1 shadow-[0px_4px_32px_0px_#00000006]',
              isWide ? 'gap-6 rounded-8 border border-purple-50 px-8 py-7' : 'gap-4 rounded-6 p-4',
            )}
          >
            <span className={cn('text-text-1', isWide ? 'text-title3' : 'text-headline2')}>
              {weakTopic.topic.displayName}
            </span>
            <Button
              asChild
              // 시안의 모바일 버튼(32 · 13 R)과 같은 크기 변형이 없어 가장 가까운 sm을 쓴다.
              size={isWide ? 'cta' : 'sm'}
              className={isWide ? undefined : 'w-full'}
            >
              <Link to="/learning/units/$unitId" params={{ unitId: String(weakTopic.unitId) }}>
                학습 콘텐츠 바로가기
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
