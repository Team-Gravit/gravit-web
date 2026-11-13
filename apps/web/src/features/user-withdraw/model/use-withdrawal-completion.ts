import { useEffect, useEffectEvent } from 'react';

import { checkWithdrawalState } from '../api/check-withdrawal';

interface UseWithdrawalCompletionOptions {
  /** 탈퇴 확정을 확인했을 때 한 번 호출된다. 세션 정리·이동은 호출부가 정한다. */
  onWithdrawn: () => void;
}

/**
 * 화면이 다시 보일 때마다 탈퇴 확정 여부를 확인한다.
 *
 * 앱에서는 메일 앱으로 넘어가 확정한 뒤 앱으로 돌아오면 `visibilitychange`가 발생한다.
 * 확인에 실패하면(네트워크 등) 지금 화면을 그대로 두고 다음 복귀 때 다시 확인한다.
 */
export function useWithdrawalCompletion({ onWithdrawn }: UseWithdrawalCompletionOptions) {
  const handleWithdrawn = useEffectEvent(onWithdrawn);

  useEffect(() => {
    let isChecking = false;
    let isDone = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || isChecking || isDone) {
        return;
      }

      isChecking = true;
      checkWithdrawalState()
        .then((state) => {
          if (state === 'withdrawn') {
            isDone = true;
            handleWithdrawn();
          }
        })
        .catch((error: unknown) => {
          console.warn(
            '[withdraw] 탈퇴 확정 여부를 확인하지 못했다. 다음 복귀 때 다시 확인한다',
            error,
          );
        })
        .finally(() => {
          isChecking = false;
        });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
}
