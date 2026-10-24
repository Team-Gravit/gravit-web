import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';
import { MascotLoading } from '@/shared/ui/mascot-loading';

const LOADING_MESSAGE = '로딩중...';
const DEFAULT_TIP = '시즌은 매주 월요일 자정에 초기화돼요.';

export interface QuizLoadingScreenProps extends Omit<ComponentProps<'div'>, 'children'> {
  tip?: string;
}

export function QuizLoadingScreen({
  tip = DEFAULT_TIP,
  className,
  ...props
}: QuizLoadingScreenProps) {
  return (
    <MascotLoading
      data-slot="quiz-loading-screen"
      message={LOADING_MESSAGE}
      description={tip}
      className={cn('min-h-full flex-1', className)}
      {...props}
    />
  );
}
