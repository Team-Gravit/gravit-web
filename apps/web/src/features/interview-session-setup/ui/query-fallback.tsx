import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export interface QueryFallbackProps {
  isError: boolean;
  onRetry: () => void;
}

/**
 * 표시할 목록이 없을 때 본문 가운데에 로딩 또는 재시도를 보여준다.
 * 조회 훅은 호출부가 관리한다. 재시도에는 해당 훅의 refetch를 연결한다.
 */
export function QueryFallback({ isError, onRetry }: QueryFallbackProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      {isError ? (
        <Button type="button" variant="stroke-neutral" onClick={onRetry}>
          다시 시도
        </Button>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
