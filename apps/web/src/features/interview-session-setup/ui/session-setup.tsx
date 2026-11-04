import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/shared/ui/button';

import { useCreateInterviewSession } from '../api/use-create-interview-session';
import {
  buildCreateSessionRequest,
  canProceed,
  getNextStep,
  getPreviousStep,
  getProgress,
  type SessionSetupStep,
} from '../model/session-setup-rules';
import { useSessionSetupStore } from '../model/session-setup-store';
import { AnswerTypeStep } from './answer-type-step';
import { ConfirmStep } from './confirm-step';
import { MicPermissionModal } from './mic-permission-modal';
import { CsTopicsStep } from './cs-topics-step';
import { DifficultyStep } from './difficulty-step';
import { JobStep } from './job-step';
import { SetupStepFrame } from './setup-step-frame';
import { StackStep } from './stack-step';
import { TopicStep } from './topic-step';
import { useAudioPlayer } from '@/shared/ui/audio-player';

interface StepHeading {
  title: string;
  description?: string;
  /** 모바일은 기본 가운데 정렬. CS 목록은 왼쪽 정렬한다. */
  align?: 'left' | 'center';
  /** 생략하면 모바일 정렬을 그대로 쓴다. */
  desktopAlign?: 'left' | 'center';
  /** 직군·스택·난이도 시안은 제목을 본문보다 8px 안쪽에 둔다. */
  isDesktopInset?: boolean;
}

// 목록·격자형 본문을 쓰는 단계는 데스크톱에서 제목을 본문 왼쪽 끝에 맞춘다.
const STEP_HEADINGS: Record<SessionSetupStep, StepHeading> = {
  'answer-type': { title: '답변 방식을 골라주세요.' },
  topic: { title: '면접에서 다룰 주제를 골라주세요' },
  'cs-topics': {
    title: '연습할 CS 분야를 골라주세요',
    description: '모든 분야를 다루고 싶다면 전체 선택을 눌러주세요',
    align: 'left',
  },
  job: { title: '연습할 직군을 선택해주세요', desktopAlign: 'left', isDesktopInset: true },
  stack: { title: '주로 다루는 스택을 골라주세요', desktopAlign: 'left', isDesktopInset: true },
  difficulty: { title: '연습할 난이도를 골라주세요.', desktopAlign: 'left', isDesktopInset: true },
  confirm: { title: '선택하신 내용을 확인해주세요', desktopAlign: 'left' },
};

// 모바일은 이전 버튼을 최소 84px로 두고 다음/시작 버튼이 남은 폭을 채운다(14370:38618).
// 글자 확대 시 이전 버튼도 늘어날 수 있도록 고정 폭 대신 최소 폭을 쓴다. 데스크톱은 둘 다 158px이다.
const PRIMARY_BUTTON_CLASS = 'flex-1 md:w-[158px] md:flex-none';
const PREVIOUS_BUTTON_CLASS = 'w-auto min-w-21 shrink-0 md:w-[158px]';

export interface SessionSetupProps {
  step: SessionSetupStep;
  /** 다음 단계. 페이지에서 경로로 바꿔 이동한다. */
  onNext: (step: SessionSetupStep) => void;
  /** 이전 단계. 방문 기록을 되돌리는 처리는 페이지에서 맡는다. */
  onPrevious: (step: SessionSetupStep) => void;
  /** 홈 버튼의 이동 처리. 초안 초기화는 부모 라우트의 onLeave가 담당한다. */
  onExit: () => void;
  /** 생성된 세션으로 이동한다. 반환한 Promise가 끝날 때까지 시작 버튼은 로딩 상태다. */
  onCreated: (sessionId: number) => Promise<void>;
}

/** 선택 초안을 공유하는 설정 화면. 현재 단계의 본문과 이전/다음/생성 버튼을 연결한다. */
export function SessionSetup({ step, onNext, onPrevious, onExit, onCreated }: SessionSetupProps) {
  const mode = useSessionSetupStore((state) => state.mode);
  const isProceedable = useSessionSetupStore((state) => canProceed(step, state));

  const heading = STEP_HEADINGS[step];
  const previousStep = getPreviousStep(step, mode);
  const nextStep = getNextStep(step, mode);

  const footer = (
    <>
      {previousStep && (
        <Button
          type="button"
          size="cta"
          variant="stroke-neutral"
          className={PREVIOUS_BUTTON_CLASS}
          onClick={() => onPrevious(previousStep)}
        >
          이전
        </Button>
      )}
      {step === 'confirm' ? (
        <StartSessionButton onCreated={onCreated} />
      ) : (
        <Button
          type="button"
          size="cta"
          className={PRIMARY_BUTTON_CLASS}
          disabled={!isProceedable || nextStep === null}
          onClick={() => nextStep && onNext(nextStep)}
        >
          다음
        </Button>
      )}
    </>
  );

  return (
    <SetupStepFrame
      title={heading.title}
      description={heading.description}
      headingAlign={heading.align}
      desktopHeadingAlign={heading.desktopAlign}
      headingClassName={heading.isDesktopInset ? 'md:px-2' : undefined}
      progress={getProgress(step, mode)}
      onExit={onExit}
      footer={footer}
    >
      <SetupStepBody step={step} />
    </SetupStepFrame>
  );
}

function SetupStepBody({ step }: { step: SessionSetupStep }) {
  const stackGroup = useSessionSetupStore((state) => state.stackGroup);

  switch (step) {
    case 'answer-type':
      return <AnswerTypeStep />;
    case 'topic':
      return <TopicStep />;
    case 'cs-topics':
      return <CsTopicsStep />;
    case 'job':
      return <JobStep />;
    case 'stack':
      // 라우트가 직군 선택을 확인한다. 조회 훅에는 null을 넘길 수 없어 렌더링에서도 검사한다.
      return stackGroup && <StackStep stackGroup={stackGroup} />;
    case 'difficulty':
      return <DifficultyStep />;
    case 'confirm':
      return <ConfirmStep />;
  }
}

/**
 * 프롬프트 없이 현재 마이크 권한이 'granted' 인지 조회한다.
 * permissions.query 미지원 브라우저는 false 로 보고 안내 모달로 유도한다.
 */
async function isMicrophoneGranted(): Promise<boolean> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' });
    return result.state === 'granted';
  } catch {
    return false;
  }
}

function StartSessionButton({ onCreated }: { onCreated: (sessionId: number) => Promise<void> }) {
  // 새 요청 객체를 selector에서 반환하면 구독값이 매번 달라진다. 초안을 얕게 구독한 뒤 요청을 만든다.
  const draft = useSessionSetupStore(
    useShallow(({ inputType, mode, topics, stackGroup, stack, difficulty }) => ({
      inputType,
      mode,
      topics,
      stackGroup,
      stack,
      difficulty,
    })),
  );
  const request = buildCreateSessionRequest(draft);
  const { mutate, isPending } = useCreateInterviewSession(onCreated);

  const { unlock } = useAudioPlayer();
  const navigate = useNavigate();
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);

  async function handleStartClick() {
    // 오디오 언락은 제스처 안에서 가장 먼저 동기로 처리한다.
    unlock();

    // 음성 모드면 마이크 권한이 허용돼 있는지 먼저 확인한다.
    // 허용돼 있지 않으면 안내 모달을 띄우고 세션을 생성하지 않는다.
    if (draft.inputType === 'VOICE' && !(await isMicrophoneGranted())) {
      setIsMicModalOpen(true);
      return;
    }

    if (request) {
      mutate({ data: request });
    }
  }

  async function handleConfirmMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setIsMicModalOpen(false);

      if (request) {
        mutate({ data: request });
      }
    } catch {
      setIsMicModalOpen(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="cta"
        className={PRIMARY_BUTTON_CLASS}
        disabled={!request}
        isLoading={isPending}
        onClick={handleStartClick}
      >
        시작하기
      </Button>
      <MicPermissionModal
        open={isMicModalOpen}
        onOpenChange={setIsMicModalOpen}
        onGoHome={() => navigate({ to: '/main' })}
        onConfirm={handleConfirmMic}
      />
    </>
  );
}
