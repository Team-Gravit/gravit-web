import { useEffect, useRef } from 'react';

import type { InterviewStackResponse } from '@/entities/interview';

import { getOnlyStack } from './session-setup-rules';
import { useSessionSetupStore } from './session-setup-store';

/**
 * 스택 선택 화면에서 처음 받은 목록에 항목이 하나뿐이면 자동 선택한다.
 * undefined는 조회 전 상태로 보고 기다리며, 목록을 받으면 개수와 관계없이 확인을 마친다.
 * 이후 목록이 갱신되거나 사용자가 선택을 해제해도 다시 자동 선택하지 않는다.
 * 화면이 새로 마운트되면 다시 확인하므로, 한 번의 마운트에서는 한 직군의 목록을 다룬다.
 */
export function usePreselectOnlyStack(stacks: readonly InterviewStackResponse[] | undefined) {
  const preselectStack = useSessionSetupStore((state) => state.preselectStack);
  const hasCheckedInitialStacksRef = useRef(false);

  useEffect(() => {
    if (hasCheckedInitialStacksRef.current || !stacks) {
      return;
    }
    hasCheckedInitialStacksRef.current = true;

    const onlyStack = getOnlyStack(stacks);
    if (onlyStack !== null) {
      preselectStack(onlyStack);
    }
  }, [stacks, preselectStack]);
}
