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

  // 단계 이동은 push로 기록해 브라우저 뒤로가기로도 이전 단계에 갈 수 있게 한다.
  function handleStepChange(nextStep: SessionSetupStep) {
    void navigate({ to: '/interview/new/$step', params: { step: nextStep } });
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
      onStepChange={handleStepChange}
      onExit={() => void navigate({ to: '/interview' })}
      onCreated={handleSessionCreated}
    />
  );
}
