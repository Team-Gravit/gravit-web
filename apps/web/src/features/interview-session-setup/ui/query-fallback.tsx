import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export interface QueryFallbackProps {
  isError: boolean;
  onRetry: () => void;
}

/**
 * CS 분야나 스택 목록을 아직 표시할 수 없을 때 사용하는 대기·실패 표시.
 * 목록이 없는 동안만 호출하며, 오류면 재시도 버튼을, 그 외에는 로딩 표시를 보여준다.
 * 재요청은 onRetry를 통해 목록을 조회한 호출부에서 처리한다.
 */
export function QueryFallback({ isError, onRetry }: QueryFallbackProps) {
  if (isError) {
    return (
      <Button type="button" variant="stroke-neutral" onClick={onRetry}>
        다시 시도
      </Button>
    );
  }
  return <Spinner />;
}
