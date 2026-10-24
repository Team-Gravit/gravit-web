import { useEffect } from 'react';

import {
  parseTranscriptText,
  useInterviewQuestions,
  useInterviewSessionStore,
  useInterviewTranscriptions,
} from '@/entities/interview-session';
import { useSubmitInterview } from '@/features/interview-submit';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { ConfirmDesktop } from './confirm/confirm-desktop';
import { ConfirmMobile } from './confirm/confirm-mobile';
import type { ConfirmItem } from './confirm/types';

interface InterviewConfirmProps {
  sessionId: number;
  /** 제출 성공 후 이동(결과 화면 등)은 페이지가 결정한다. */
  onSubmitted: () => void;
}

/** 답변 확인 화면. 데이터 조회·수화·제출을 맡고, 뷰포트에 따라 데스크톱/모바일 뷰로 분기한다. */
export function InterviewConfirm({ sessionId, onSubmitted }: InterviewConfirmProps) {
  const isWide = useIsWideViewport();

  // 확인 화면 진입(직접 접근·새로고침 포함) 시 store를 이 세션으로 정렬한다. 중단 등 액션이 sessionId를 쓴다.
  // 정상 진입은 같은 세션이라 no-op 이고, 다른 세션 잔재가 있을 때만 정리된다.
  const enterSession = useInterviewSessionStore((s) => s.enterSession);

  useEffect(() => {
    enterSession(sessionId);
  }, [sessionId, enterSession]);

  const { data: questionsData } = useInterviewQuestions(sessionId);
  const isVoice = questionsData?.inputType === 'VOICE';
  const { data: transcriptionsData } = useInterviewTranscriptions(sessionId, {
    enabled: isVoice,
  });

  useHydrateAnswers(transcriptionsData?.transcriptions ?? []);

  const { submit, isPending } = useSubmitInterview();

  if (!questionsData) {
    return null;
  }

  const items: ConfirmItem[] = questionsData.questions.map((question) => {
    const transcription = transcriptionsData?.transcriptions.find(
      (item) => item.displayOrder === question.displayOrder,
    );
    return {
      displayOrder: question.displayOrder,
      question: question.content,
      status: transcription?.status,
      audioUrl: transcription?.audioUrl,
    };
  });

  const handleSubmit = () => submit({ onSuccess: onSubmitted });
  const Layout = isWide ? ConfirmDesktop : ConfirmMobile;

  return <Layout items={items} isPending={isPending} onSubmit={handleSubmit} />;
}

/** COMPLETED 변환 텍스트를 store content로 1회 수화한다. */
function useHydrateAnswers(
  transcriptions: { displayOrder: number; status?: string; transcript?: string }[],
) {
  const setAnswerContent = useInterviewSessionStore((s) => s.setAnswerContent);
  const markHydrated = useInterviewSessionStore((s) => s.markHydrated);

  useEffect(() => {
    const { hydratedOrders } = useInterviewSessionStore.getState();
    transcriptions.forEach((transcription) => {
      const isHydrated = hydratedOrders.includes(transcription.displayOrder);
      if (transcription.status === 'COMPLETED' && transcription.transcript && !isHydrated) {
        setAnswerContent(transcription.displayOrder, parseTranscriptText(transcription.transcript));
        markHydrated(transcription.displayOrder);
      }
    });
  }, [transcriptions, setAnswerContent, markHydrated]);
}
