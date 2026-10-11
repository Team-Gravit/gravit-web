import { notFound, redirect, type ParsedLocation } from '@tanstack/react-router';

import {
  canEnterSessionSetupStep,
  isSessionSetupStep,
  resetSessionSetup,
} from '@/features/interview-session-setup';

/**
 * 잘못된 단계는 404, 앞 단계 선택이 없는 경우는 첫 단계로 보낸다.
 * 화면에서 초안을 구독하며 검사하면 이탈 중 초기화에도 반응하므로 라우트 진입 시에만 검사한다.
 */
export function guardSessionSetupStep({ params }: { params: { step: string } }) {
  if (!isSessionSetupStep(params.step)) {
    throw notFound();
  }
  // 초안은 새로고침 시 사라진다. 중간 URL로 들어와도 앞 단계 선택부터 다시 시작한다.
  if (!canEnterSessionSetupStep(params.step)) {
    throw redirect({
      to: '/interview/new/$step',
      params: { step: 'answer-type' },
      replace: true,
    });
  }

  return { step: params.step };
}

// 부모 라우트가 처음 들어온 위치만 기억한다. 단계별 URL 이동으로 덮어쓰지 않는다.
let setupEntryHistoryIndex = 0;

/**
 * 설정 첫 진입 위치를 기록한다. 단계 이동(stay)과 링크 미리 조회(preload)는 기록하지 않는다.
 * 생성 후 페이지가 이 위치로 돌아가 세션 화면으로 교체한다.
 */
export function recordSessionSetupEntry({
  location,
  cause,
}: {
  location: ParsedLocation;
  cause: 'enter' | 'stay' | 'preload';
}) {
  if (cause === 'enter') {
    setupEntryHistoryIndex = location.state.__TSR_index;
  }
}

/** 부모 라우트의 beforeLoad가 기록한 첫 진입 위치. 페이지의 생성 후 이동에서 사용한다. */
export function getSessionSetupEntryHistoryIndex() {
  return setupEntryHistoryIndex;
}

/**
 * 설정 부모 라우트의 onLeave에 연결한다. 홈·뒤로가기·세션 이동으로 나갈 때 초안을 비운다.
 * 부모 안에서 단계를 오가는 동안에는 호출되지 않는다.
 */
export const leaveSessionSetup = resetSessionSetup;
