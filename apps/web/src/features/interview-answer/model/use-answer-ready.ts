import { useEffect, useState } from 'react';

import { useAudioPlayer } from '@/shared/ui/audio-player';
import { useInterviewSessionStore } from '@/entities/interview-session';

/**
 * 현재 문항 음성이 끝나야 답변을 시작할 수 있다(문항 전환 중에는 비활성).
 * voice·text 공통 게이트. `onReady`는 음성 종료 시 1회 호출된다(voice 자동녹음 등).
 */
export function useAnswerReady(onReady?: () => void): boolean {
  const { onEnded } = useAudioPlayer();
  const currentIndex = useInterviewSessionStore((s) => s.currentIndex);
  const [syncedIndex, setSyncedIndex] = useState(currentIndex);
  const [canAnswer, setCanAnswer] = useState(false);

  // 문항이 바뀌면 다음 질문 음성이 끝날 때까지 답변 시작을 막는다(렌더 중 리셋).
  if (currentIndex !== syncedIndex) {
    setSyncedIndex(currentIndex);
    setCanAnswer(false);
  }

  useEffect(() => {
    return onEnded(() => {
      setCanAnswer(true);
      onReady?.();
    });
  }, [onEnded, onReady]);

  return canAnswer;
}
