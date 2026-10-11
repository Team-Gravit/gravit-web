import { useNavigate, useRouter } from '@tanstack/react-router';

import { rewindHistory } from '@/shared/lib/rewind-history';

import { SessionSetup, type SessionSetupStep } from '@/features/interview-session-setup';

interface InterviewSetupPageProps {
  step: SessionSetupStep;
  /** 설정 첫 진입의 기록 위치. 생성 후 이 위치를 세션 화면으로 교체한다. */
  entryHistoryIndex: number;
}

/** 설정 화면의 단계 이동, 홈 이동, 생성 후 세션 이동을 라우터에 연결한다. */
export function InterviewSetupPage({ step, entryHistoryIndex }: InterviewSetupPageProps) {
  const navigate = useNavigate();
  const router = useRouter();

  // 다음 단계는 방문 기록에 남겨 브라우저 뒤로가기로도 돌아올 수 있게 한다.
  function handleNext(nextStep: SessionSetupStep) {
    void navigate({ to: '/interview/new/$step', params: { step: nextStep } });
  }

  // 이전 버튼은 새 기록을 쌓지 않고 한 단계 되돌린다.
  // 설정 진입 위치라 되돌릴 기록이 없으면 현재 경로를 이전 단계로 바꾼다.
  function handlePrevious(previousStep: SessionSetupStep) {
    if (router.history.location.state.__TSR_index > entryHistoryIndex) {
      router.history.back();
      return;
    }
    void navigate({ to: '/interview/new/$step', params: { step: previousStep }, replace: true });
  }

  // 생성 후 뒤로가기가 초기화된 설정 단계로 돌아가지 않도록 첫 진입 위치를 세션 화면으로 교체한다.
  async function handleSessionCreated(sessionId: number) {
    await rewindHistory(router.history, entryHistoryIndex);
    await navigate({
      to: '/interview/sessions/$sessionId',
      params: { sessionId: String(sessionId) },
      replace: true,
    });
  }

  return (
    <SessionSetup
      step={step}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onExit={() => void navigate({ to: '/interview' })}
      onCreated={handleSessionCreated}
    />
  );
}
