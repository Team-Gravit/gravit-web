import { useEffect } from 'react';

import { useBlocker } from '@tanstack/react-router';

import { INTERVIEW_QUESTION_COUNT, useInterviewSessionStore } from '@/entities/interview-session';
import { InterviewAbandonModal, useAbandonInterview } from '@/features/interview-abandon';

interface InterviewSessionBlockerProps {
  isInProgress: boolean;
}

/**
 * 나가기 확인 모달의 단독 소유자. 두 경로로 열린다 — 홈(그만두기) 버튼 요청과 브라우저 뒤로가기.
 * 둘 다 store의 isLeaveRequested 하나를 세워 모달을 항상 하나만 띄운다(중복 노출 방지).
 * "나가기"는 경로와 무관하게 명시적 이탈이므로 중단 API를 보낸다(이동·진행 상태 비우기는 useAbandonInterview가 처리).
 *
 * raw history 조작은 TanStack Router의 내부 history 인덱스를 어긋나게 하므로 라우터 전용 useBlocker 를 쓴다.
 * withResolver 로 네비게이션을 '보류'하면 두 번째 뒤로가기가 그 틈으로 새어나가므로(히스토리를 건너뛰어 이탈),
 * 보류 없이 매 BACK 을 즉시 취소하고(그 자리 유지) 모달은 store 상태로만 제어한다.
 * 나가기 버튼·제출 등 프로그램 이동은 action !== 'BACK' 이라 통과한다.
 */
export function InterviewSessionBlocker({ isInProgress }: InterviewSessionBlockerProps) {
  const isLeaveRequested = useInterviewSessionStore((s) => s.isLeaveRequested);
  const requestLeave = useInterviewSessionStore((s) => s.requestLeave);
  const cancelLeave = useInterviewSessionStore((s) => s.cancelLeave);
  const setIsPaused = useInterviewSessionStore((s) => s.setIsPaused);
  const { abandon, isPending } = useAbandonInterview();

  useBlocker({
    shouldBlockFn: ({ action }) => {
      const shouldBlock = isInProgress && action === 'BACK';
      if (shouldBlock) {
        requestLeave();
      }
      return shouldBlock;
    },
  });

  // 모달이 떠 있는 동안 세션 미디어(영상·오디오·녹음)를 멈춘다. 이 컴포넌트가 isPaused의 단독 writer다.
  useEffect(() => {
    setIsPaused(isLeaveRequested);
  }, [isLeaveRequested, setIsPaused]);

  const handleConfirm = () => {
    // 명시적 이탈이므로 중단 API를 보낸다. 모달·일시정지는 abandon 이 /interview 로 이동하며
    // reset 할 때까지 유지한다(즉시 닫으면 비동기 응답 대기 동안 미디어가 잠깐 재생되는 깜빡임이 생긴다).
    abandon();
  };

  return (
    <InterviewAbandonModal
      open={isLeaveRequested}
      onOpenChange={(open) => {
        if (!open) cancelLeave();
      }}
      questionCount={INTERVIEW_QUESTION_COUNT}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
