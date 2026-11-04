import { useEffect } from 'react';

import {
  isSessionCompleted,
  useInterviewQuestions,
  useInterviewSessionStore,
} from '@/entities/interview-session';
import { InterviewAbandonButton } from '@/features/interview-abandon';
import { useAudioPlayer } from '@/shared/ui/audio-player';

import { QuestionStage } from './question-stage';
import { SessionFooter } from './session-footer';

interface InterviewSessionProps {
  sessionId: number;
  /** 마지막 문항까지 답하면 호출한다. 이동(확인 페이지)은 페이지가 결정한다. */
  onComplete: () => void;
}

/** AI 면접 세션 진행 화면. 문항 조회·오디오 재생 구동과 화면 조립을 담당한다. */
export function InterviewSession({ sessionId, onComplete }: InterviewSessionProps) {
  const { data, isPending } = useInterviewQuestions(sessionId);
  const { play, pause, resume, stop } = useAudioPlayer();
  const currentIndex = useInterviewSessionStore((s) => s.currentIndex);
  const enterSession = useInterviewSessionStore((s) => s.enterSession);
  const isPaused = useInterviewSessionStore((s) => s.isPaused);

  // 세션 진입 시 store에 sessionId를 등록한다(같은 세션이면 진행 복원, 다르면 초기화).
  useEffect(() => {
    enterSession(sessionId);
  }, [sessionId, enterSession]);

  const isCompleted =
    Boolean(data) && isSessionCompleted(currentIndex, data?.questions.length ?? 0);

  // 마지막 문항까지 답해 index가 범위를 넘으면 완료로 보고 상위에 알린다.
  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  useEffect(() => {
    const audioUrl = data?.questions[currentIndex]?.audioUrl;

    if (audioUrl) {
      play(audioUrl);
    }
  }, [data, play, currentIndex]);

  useEffect(() => {
    if (isPaused) {
      pause();
      return;
    }

    resume();
  }, [isPaused, pause, resume]);

  // 세션 화면을 벗어나면(언마운트) 재생 중인 질문 오디오를 멈춘다. 오디오 element 는 상위 레이아웃에 있어
  // 페이지를 떠나도 계속 재생되므로 여기서 명시적으로 정지한다.
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  if (isPending || !data) return null;
  if (isCompleted) return null; // 확인 페이지로 이동 중

  const currentQuestion = data.questions[currentIndex];

  return (
    <main className="flex flex-col items-center justify-between bg-bg-2 h-svh ">
      <header className="md:px-8 md:pt-7 w-full h-12 md:h-auto flex items-center justify-between bg-bg-0 md:bg-transparent border-b border-divider-1 md:border-0">
        <InterviewAbandonButton />
      </header>
      <QuestionStage
        current={currentIndex + 1}
        total={data.questions.length}
        content={currentQuestion.content}
      />
      <SessionFooter inputType={data.inputType} />
    </main>
  );
}
