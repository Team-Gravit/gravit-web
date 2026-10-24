import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

export type RecordingPlayerSize = 'sm' | 'md' | 'lg';

export interface RecordingPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /** duration - currentTime(초). duration 미확정이면 duration 값. */
  remaining: number;
}

export interface RecordingPlayerProps {
  /** 재생할 음성 URL. 없으면 비활성. */
  audioUrl?: string;
  /** 재생 버튼·아이콘 크기. sm(모바일) · md(리포트) · lg(데스크톱, 기본). */
  size?: RecordingPlayerSize;
  /** 루트 컨테이너에 덧붙일 클래스(레이아웃·테두리 등). */
  className?: string;
  /**
   * 우측 라벨 슬롯. 재생 상태를 받아 렌더한다. 미지정 시 남은시간만 표시한다.
   * 화면마다 라벨 문구가 달라 슬롯으로 연다.
   */
  renderLabel?: (state: RecordingPlayerState) => ReactNode;
}

const BUTTON_SIZE: Record<RecordingPlayerSize, string> = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-[54px]',
};

const ICON_SIZE: Record<RecordingPlayerSize, string> = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-6',
};

/** 초를 "mm:ss"로 포맷한다. 유한하지 않거나 음수면 "00:00". */
export function formatPlaybackTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }
  const total = Math.floor(seconds);
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/** 음성 재생 플레이어. audioUrl 을 네이티브 audio 로 재생하고 진행률·라벨을 표시한다. */
export function RecordingPlayer({
  audioUrl,
  size = 'lg',
  className,
  renderLabel,
}: RecordingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 원격 음성은 Content-Length 가 없으면 duration 이 Infinity 로 올 수 있어 유한값일 때만 쓴다.
  const hasDuration = Number.isFinite(duration) && duration > 0;
  const progress = hasDuration ? (currentTime / duration) * 100 : 0;
  const remaining = hasDuration ? duration - currentTime : duration;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <div
      data-slot="recording-player"
      className={cn(
        'flex w-full items-center gap-3 rounded-full border border-divider-1 bg-bg-0 p-2 pr-4 shadow-elevation-1 md:gap-5 md:p-3 md:pr-7',
        className,
      )}
    >
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <button
        type="button"
        onClick={toggle}
        disabled={!audioUrl}
        aria-label={isPlaying ? '녹음 일시정지' : '녹음 재생'}
        className={cn(
          'grid shrink-0 cursor-pointer place-items-center rounded-full bg-main disabled:cursor-not-allowed disabled:bg-divider-1',
          BUTTON_SIZE[size],
        )}
      >
        <Icon
          name={isPlaying ? 'pause-fill' : 'play-fill'}
          className={cn('text-white', ICON_SIZE[size])}
        />
      </button>

      <span
        role="progressbar"
        aria-label="재생 위치"
        aria-valuemin={0}
        aria-valuemax={hasDuration ? Math.round(duration) : 0}
        aria-valuenow={Math.round(currentTime)}
        className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-bg-2"
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-main transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </span>

      {renderLabel ? (
        renderLabel({ isPlaying, currentTime, duration, remaining })
      ) : (
        <span className="text-caption1 shrink-0 text-text-1">{formatPlaybackTime(remaining)}</span>
      )}
    </div>
  );
}
