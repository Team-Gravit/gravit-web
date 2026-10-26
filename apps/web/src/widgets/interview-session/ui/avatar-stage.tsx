import { useEffect, useRef, useState } from 'react';

import { useInterviewSessionStore } from '@/entities/interview-session';
import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { useAudioPlayer } from '@/shared/ui/audio-player';

import { pickNextReaction, type AvatarReaction } from '../lib/pick-next-reaction';

import desktopAPoster from './assets/desktop-a-poster.png';
import desktopListen from './assets/desktop-a-video-listen.mp4';
import desktopMemo from './assets/desktop-a-video-memo.mp4';
import desktopWorry from './assets/desktop-a-video-worry.mp4';
import desktopQPoster from './assets/desktop-q-poster.png';
import desktopQVideo from './assets/desktop-q-video.mp4';
import mobileAPoster from './assets/mobile-a-poster.png';
import mobileListen from './assets/mobile-a-video-listen.mp4';
import mobileMemo from './assets/mobile-a-video-memo.mp4';
import mobileWorry from './assets/mobile-a-video-worry.mp4';
import mobileQPoster from './assets/mobile-q-poster.png';
import mobileQVideo from './assets/mobile-q-video.mp4';

type AvatarPhase = 'question' | 'waiting' | 'answer';

interface AvatarDeviceSources {
  /** ① 질문 단계: 재생할 Q 영상과 로딩 전 포스터. */
  questionVideo: string;
  questionPoster: string;
  /** ② 대기 단계: 음성 끝~답변 시작 전 정적으로 렌더할 포스터(A 영상 첫 구도와 맞춘 a-poster). */
  waitingPoster: string;
  /** ③ 답변 단계: 리액션별 A 영상. */
  reactions: Record<AvatarReaction, string>;
}

const AVATAR_SOURCES = {
  desktop: {
    questionVideo: desktopQVideo,
    questionPoster: desktopQPoster,
    waitingPoster: desktopAPoster,
    reactions: { listen: desktopListen, memo: desktopMemo, worry: desktopWorry },
  },
  mobile: {
    questionVideo: mobileQVideo,
    questionPoster: mobileQPoster,
    waitingPoster: mobileAPoster,
    reactions: { listen: mobileListen, memo: mobileMemo, worry: mobileWorry },
  },
} satisfies Record<'desktop' | 'mobile', AvatarDeviceSources>;

function getAvatarPhase(isPlaying: boolean, isAnswering: boolean): AvatarPhase {
  if (isPlaying) return 'question';
  if (isAnswering) return 'answer';
  return 'waiting';
}

// 모든 레이어를 겹쳐 두고 opacity 로 전환한다. 기본은 즉시 전환.
const AVATAR_LAYER_CLASS = 'absolute inset-0 w-full h-full object-cover';
// Q 영상 → 대기 포스터로 넘어가는 순간에만 주는 1초 크로스페이드.
const FADE_CLASS = 'transition-opacity duration-1000';

const ANSWER_SLOTS = [0, 1] as const;
type AnswerSlot = (typeof ANSWER_SLOTS)[number];

export function AvatarStage() {
  const { isPlaying } = useAudioPlayer();
  const isAnswering = useInterviewSessionStore((s) => s.isAnswering);
  const isWide = useIsWideViewport();

  const sources = AVATAR_SOURCES[isWide ? 'desktop' : 'mobile'];
  const phase = getAvatarPhase(isPlaying, isAnswering);

  // 이전 렌더의 phase 와 비교해 전환 방향을 감지한다(렌더 중 파생 state).
  // Q → 대기 전환 순간에만 크로스페이드를 주고, 진입(→Q)·답변 등 다른 전환은 즉시.
  const [phases, setPhases] = useState({ prev: phase, last: phase });
  if (phases.last !== phase) {
    setPhases({ prev: phases.last, last: phase });
  }
  const isQuestionToWaiting = phases.prev === 'question' && phase === 'waiting';
  const fadeClass = isQuestionToWaiting ? FADE_CLASS : '';

  // 답변 리액션 이중 버퍼. 한 엘리먼트에서 src 를 바꾸면 로딩 동안 깜빡이므로 두 레이어를
  // 번갈아 쓴다. 보이는 front 가 재생되는 동안 숨은 쪽에 다음 리액션을 미리 로드해 두고,
  // ended 때 이미 로드된 쪽으로 즉시 전환한다(리액션끼리 구도가 같아 한 영상처럼 이어진다).
  const slotRefs = useRef<Record<AnswerSlot, HTMLVideoElement | null>>({ 0: null, 1: null });
  const [slotReactions, setSlotReactions] = useState<Record<AnswerSlot, AvatarReaction>>(() => ({
    0: 'listen',
    1: pickNextReaction('listen'),
  }));
  const [front, setFront] = useState<AnswerSlot>(0);

  // 답변 단계면 현재 front 를 재생, 아니면 둘 다 정지. isWide 를 의존성에 둬 뷰포트 전환으로
  // src 가 바뀌어 재로드돼도 다시 재생시켜 끊기지 않게 한다.
  useEffect(() => {
    const { 0: first, 1: second } = slotRefs.current;
    if (phase !== 'answer') {
      first?.pause();
      second?.pause();
      return;
    }

    const video = slotRefs.current[front];
    if (video) {
      video.play().catch(() => {});
    }
  }, [phase, front, isWide]);

  // 재생이 끝나면 미리 로드해 둔 다음 영상(back)으로 전환하고, 비워진 슬롯에 그 다음을 로드한다.
  const handleEnded = (slot: AnswerSlot) => {
    if (phase !== 'answer' || slot !== front) return;

    const back: AnswerSlot = slot === 0 ? 1 : 0;
    setFront(back);
    setSlotReactions((prev) => ({ ...prev, [slot]: pickNextReaction(prev[back]) }));
  };

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      <video
        muted
        autoPlay
        loop
        playsInline
        src={sources.questionVideo}
        poster={sources.questionPoster}
        className={cn(AVATAR_LAYER_CLASS, fadeClass)}
        style={{ opacity: phase === 'question' ? 1 : 0 }}
      />
      <img
        src={sources.waitingPoster}
        alt=""
        className={cn(AVATAR_LAYER_CLASS, fadeClass)}
        style={{ opacity: phase === 'waiting' ? 1 : 0 }}
      />
      {ANSWER_SLOTS.map((slot) => (
        <video
          key={slot}
          ref={(el) => {
            slotRefs.current[slot] = el;
          }}
          muted
          playsInline
          preload="auto"
          src={sources.reactions[slotReactions[slot]]}
          poster={sources.waitingPoster}
          onEnded={() => handleEnded(slot)}
          className={AVATAR_LAYER_CLASS}
          style={{ opacity: phase === 'answer' && front === slot ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
