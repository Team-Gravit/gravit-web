import {
  MAX_RECORDING_MS,
  MIN_RECORDING_MS,
  useInterviewSessionStore,
} from '@/entities/interview-session';
import { useAudioPlayer } from '@/shared/ui/audio-player';

import { useAnswerReady } from '../model/use-answer-ready';
import { useRecording } from '../model/use-recording';
import { useSubmitVoiceAnswer } from '../model/use-submit-voice-answer';
import { AnswerButton } from './answer-button';

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function VoiceAnswerButton() {
  const { isPlaying } = useAudioPlayer();
  const submit = useSubmitVoiceAnswer();
  const goNext = useInterviewSessionStore((s) => s.goNext);
  const startAnswering = useInterviewSessionStore((s) => s.startAnswering);

  const { isRecording, elapsedMs, startRecording, stopRecording } = useRecording({
    onStop: (blob) => {
      if (blob.size === 0) {
        goNext();
        return;
      }

      submit.mutate(blob, { onSuccess: goNext });
    },
    onStart: startAnswering,
  });

  // 질문 음성이 끝나면 답변 가능. 자동녹음이 켜져 있으면 바로 녹음을 시작한다.
  const canAnswer = useAnswerReady(() => {
    if (useInterviewSessionStore.getState().isAutoRecord) {
      startRecording();
    }
  });

  // 녹음이 너무 짧으면 답변 완료를 무시한다. 아무 반응 없이 녹음을 계속한다.
  const handleStopAnswer = () => {
    if (elapsedMs < MIN_RECORDING_MS) {
      return;
    }
    stopRecording();
  };

  if (isPlaying) {
    return <AnswerButton disabled>질문 재생 중</AnswerButton>;
  }

  if (isRecording) {
    const remainingMs = Math.max(0, MAX_RECORDING_MS - elapsedMs);
    const fillPercent = (remainingMs / MAX_RECORDING_MS) * 100;

    return (
      <AnswerButton
        onClick={handleStopAnswer}
        className="relative gap-3 overflow-hidden border-0 bg-purple-200"
      >
        {/* 남은 시간 fill — 오른쪽 고정, width 가 남은 비율만큼 줄어든다. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 bg-main transition-[width] duration-200 ease-linear"
          style={{ width: `${fillPercent}%` }}
        />
        <span className="relative text-headline2 text-white">답변 완료하기</span>
        <span aria-hidden="true" className="relative h-0.5 w-[23px] bg-white" />
        <span className="relative text-heading2 text-white">{formatRemaining(remainingMs)}</span>
      </AnswerButton>
    );
  }

  return (
    <AnswerButton onClick={startRecording} disabled={!canAnswer || submit.isPending}>
      답변 시작하기
    </AnswerButton>
  );
}
