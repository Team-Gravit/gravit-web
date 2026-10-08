import type { MouseEvent } from 'react';

import { useCanGoBack, useRouter } from '@tanstack/react-router';

export interface UseHistoryBackClickOptions {
  isEnabled?: boolean;
}

/**
 * 이전 라우터 기록이 있으면 돌아가고, 없거나 비활성화됐으면 링크 목적지로 이동한다.
 * 보조 키 클릭은 새 탭 열기 등 링크의 기본 동작을 유지한다.
 */
export function useHistoryBackClick({ isEnabled = true }: UseHistoryBackClickOptions = {}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    const isModifiedClick =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (!isEnabled || !canGoBack || isModifiedClick) {
      return;
    }

    // Link의 경로 이동과 history.back()이 함께 실행되지 않도록 막는다.
    event.preventDefault();
    router.history.back();
  };
}
