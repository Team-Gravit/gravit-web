import { CardRetryStatus } from '@/shared/ui/card';

export interface SessionCheckErrorProps {
  /** 끝날 때까지 다시 시도 버튼이 진행 중으로 보인다. */
  onRetry: () => Promise<unknown>;
}

/** 사용자 정보를 받지 못해 온보딩 완료 여부를 판정할 수 없을 때 보여준다. */
export function SessionCheckError({ onRetry }: SessionCheckErrorProps) {
  return (
    <div data-slot="session-check-error" className="flex min-h-dvh flex-col bg-bg-0 px-4">
      <CardRetryStatus sectionName="사용자 정보" onRetry={onRetry} />
    </div>
  );
}
