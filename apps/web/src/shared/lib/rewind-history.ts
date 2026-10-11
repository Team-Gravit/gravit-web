import type { RouterHistory } from '@tanstack/react-router';

/**
 * targetIndex로 돌아간 뒤, 기록 변경 알림을 받으면 완료한다.
 * 이후 replace는 돌아간 위치를 교체하고, push는 앞으로 가기 기록을 지운다.
 * 이미 해당 위치이거나 그보다 앞이면 이동하지 않는다.
 */
export function rewindHistory(history: RouterHistory, targetIndex: number): Promise<void> {
  const steps = history.location.state.__TSR_index - targetIndex;

  if (steps <= 0) {
    return Promise.resolve();
  }
  // 브라우저의 go()는 비동기다. 이동 전에 구독해 다음 navigate가 기록 변경보다 먼저 실행되지 않게 한다.
  return new Promise((resolve) => {
    const unsubscribe = history.subscribe(() => {
      unsubscribe();
      resolve();
    });
    history.go(-steps);
  });
}
