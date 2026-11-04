import { useEffect, useRef } from 'react';

import { useInterviewSessionStore } from '@/entities/interview-session';

/**
 * 세션 진행/확인 페이지가 '플로우 밖'으로 언마운트될 때 진행 상태(persist 포함)를 비운다.
 * 이탈 경로(모달·뒤로가기·나가기 버튼)가 여러 개라 이동 주체마다 reset을 부르는 대신 언마운트 한 곳에 모은다.
 * 언마운트 시점의 목적지가 `/interview/sessions/*`이면(확인·채점 등 내부 이동) 비우지 않는다.
 * 서버 중단(abandon)과 달리 네트워크 요청이 아니라 로컬 전용이므로 다른 이탈 처리와 중복돼도 안전하다.
 */
export function useResetSessionOnExit() {
  const reset = useInterviewSessionStore((s) => s.reset);
  const resetRef = useRef(reset);
  useEffect(() => {
    resetRef.current = reset;
  });

  useEffect(() => {
    return () => {
      // 언마운트 시점의 '실제' 경로를 봐야 하므로 라우터 state가 아니라 window.location 을 읽는다.
      // '/interview/sessions' 경로 리터럴에 의존한다 — 세션 플로우 라우트(진행·확인·채점)를 옮기면 여기도 함께 고쳐야 한다.
      if (!window.location.pathname.startsWith('/interview/sessions')) {
        resetRef.current();
      }
    };
  }, []);
}
