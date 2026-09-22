import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/spinner';

const LOADING_MESSAGE = '로딩중...';
const DEFAULT_TIP = '시즌은 매주 월요일 자정에 초기화돼요.';

export interface LoadingScreenProps extends Omit<ComponentProps<'div'>, 'children'> {
  tip?: string;
}

/**
 * 풀이 화면은 데이터 요청 중에도 전용 메시지와 팁을 보여준다. 마스코트 에셋이 준비되면
 * Spinner를 교체한다.
 */
export function LoadingScreen({ tip = DEFAULT_TIP, className, ...props }: LoadingScreenProps) {
  return (
    <div
      data-slot="loading-screen"
      className={cn(
        'flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-4 text-center',
        className,
      )}
      {...props}
    >
      <Spinner size="lg" label={null} className="text-cta" />
      <p aria-live="polite" className="text-headline1 text-text-1 md:text-title3">
        {LOADING_MESSAGE}
      </p>
      <p className="text-label1 text-text-4">{tip}</p>
    </div>
  );
}
