import { useRef, useState } from 'react';

import { Icon } from '@/shared/ui/icon';

const SECONDS_PER_MINUTE = 60;

function formatPlaybackTime(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(Math.floor(totalSeconds), 0) : 0;
  const minutes = Math.floor(safeSeconds / SECONDS_PER_MINUTE);
  const seconds = safeSeconds % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export interface AnswerAudioPlayerProps {
  /** 발급 후 30분 동안 유효한 재생 URL. 만료되면 화면을 다시 열어야 새 URL을 받는다. */
  audioUrl: string;
}

export function AnswerAudioPlayer({ audioUrl }: AnswerAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);

  const progressRatio = durationSeconds > 0 ? currentTimeSeconds / durationSeconds : 0;

  const handleAudioPlayToggle = () => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }
    if (audioElement.paused) {
      void audioElement.play();
      return;
    }
    audioElement.pause();
  };

  return (
    <div className="flex h-12 min-w-0 items-center gap-3 rounded-full bg-white py-3 pr-4 pl-3 shadow-elevation-1 md:gap-5 md:pr-7">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => setDurationSeconds(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTimeSeconds(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={handleAudioPlayToggle}
        aria-label={isPlaying ? '답변 녹음 일시정지' : '답변 녹음 재생'}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-main-1 text-icon-w"
      >
        <Icon name={isPlaying ? 'pause-circle' : 'play'} size={14} />
      </button>
      <div
        role="progressbar"
        aria-label="재생 위치"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationSeconds)}
        aria-valuenow={Math.round(currentTimeSeconds)}
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-bg-2"
      >
        <div
          className="h-full rounded-full bg-main-1"
          style={{ width: `${progressRatio * 100}%` }}
        />
      </div>
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <span className="text-caption1 text-text-1">{formatPlaybackTime(durationSeconds)}</span>
        <span className="hidden text-caption2 text-text-4 md:inline">
          남은시간 {formatPlaybackTime(durationSeconds - currentTimeSeconds)}
        </span>
      </div>
    </div>
  );
}
