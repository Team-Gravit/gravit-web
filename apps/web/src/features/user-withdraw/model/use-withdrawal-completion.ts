import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { subscribeNativeEvent } from '@/shared/api';

import { checkWithdrawalState, type WithdrawalState } from '../api/check-withdrawal';

/** 확인 결과. `unknown`은 네트워크 오류처럼 판단할 수 없었던 경우다. */
export type WithdrawalCheckResult = WithdrawalState | 'unknown';

interface UseWithdrawalCompletionOptions {
  /** 탈퇴 확정을 확인했을 때 한 번 호출된다. 세션 정리·이동은 호출부가 정한다. */
  onWithdrawn: () => void;
}

interface UseWithdrawalCompletionResult {
  /** 지금 바로 확인한다. 이미 확인 중이면 그 결과를 함께 기다린다. */
  checkNow: () => Promise<WithdrawalCheckResult>;
  isChecking: boolean;
}

/**
 * 화면으로 돌아올 때마다 탈퇴 확정 여부를 확인한다.
 *
 * 메일 앱에서 확정한 뒤 돌아오는 신호는 두 가지다. 브라우저의 `visibilitychange`와, 앱이 보내는
 * `APP_FOREGROUND` 브릿지 이벤트다. iOS WKWebView는 앱 복귀 때 `visibilitychange`를 보내지 않는
 * 경우가 있어 둘 다 듣는다. 신호가 겹쳐도 확인 요청은 한 번만 보낸다.
 * 확인에 실패하면(네트워크 등) 지금 화면을 그대로 두고 다음 복귀 때 다시 확인한다.
 */
export function useWithdrawalCompletion({
  onWithdrawn,
}: UseWithdrawalCompletionOptions): UseWithdrawalCompletionResult {
  const [isChecking, setIsChecking] = useState(false);
  const pendingCheckRef = useRef<Promise<WithdrawalCheckResult> | null>(null);
  const isDoneRef = useRef(false);

  const checkNow = (): Promise<WithdrawalCheckResult> => {
    if (isDoneRef.current) {
      return Promise.resolve('withdrawn');
    }

    if (pendingCheckRef.current) {
      return pendingCheckRef.current;
    }

    setIsChecking(true);
    const pendingCheck = checkWithdrawalState()
      .then((state): WithdrawalCheckResult => {
        if (state === 'withdrawn') {
          isDoneRef.current = true;
          onWithdrawn();
        }
        return state;
      })
      .catch((error: unknown): WithdrawalCheckResult => {
        console.warn(
          '[withdraw] 탈퇴 확정 여부를 확인하지 못했다. 다음 복귀 때 다시 확인한다',
          error,
        );
        return 'unknown';
      })
      .finally(() => {
        pendingCheckRef.current = null;
        setIsChecking(false);
      });

    pendingCheckRef.current = pendingCheck;
    return pendingCheck;
  };

  const checkOnReturn = useEffectEvent(() => {
    void checkNow();
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkOnReturn();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const unsubscribeForeground = subscribeNativeEvent('APP_FOREGROUND', () => checkOnReturn());

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribeForeground();
    };
  }, []);

  return { checkNow, isChecking };
}
