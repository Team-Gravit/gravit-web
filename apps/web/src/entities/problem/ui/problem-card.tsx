import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Card } from '@/shared/ui/card';

import type { Problem } from '../model/problem';

export interface ProblemCardProps extends Omit<ComponentProps<'section'>, 'children'> {
  problem: Problem;
  /**
   * 목록에서의 순번
   */
  number: number;
  children?: ReactNode;
}

/** 문제 하나를 표시하는 컴포넌트 */
export function ProblemCard({ problem, number, children, className, ...props }: ProblemCardProps) {
  const displayNumber = String(number).padStart(2, '0');

  return (
    <>
      <Card
        data-slot="problem-card"
        className={cn('gap-5', className)}
        aria-label={`${displayNumber}번 문제`}
        {...props}
      >
        <div className="flex flex-col gap-5">
          <span className="flex flex-col gap-2">
            <span className="text-heading1 text-text-1 md:text-title2">{displayNumber}</span>
            <p className="text-headline1 text-text-1 md:text-heading1">{problem.instruction}</p>
          </span>
          <p className="text-body2-reading text-text-1 whitespace-pre-line md:text-body1-reading">
            {problem.content}
          </p>
        </div>
      </Card>
      {children}
    </>
  );
}
