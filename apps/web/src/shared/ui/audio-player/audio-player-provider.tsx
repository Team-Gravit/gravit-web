import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';

interface AudioPlayerProviderProps {
  children: ReactNode;
}

/** 코드로 유효한 짧은 무음 WAV data URI 생성 — unlock 전용(파일·asset 불필요). */
function makeSilentWavDataUri(ms = 100, sampleRate = 8000): string {
  const dataSize = Math.floor((sampleRate * ms) / 1000); // 8bit mono → 1 byte/sample
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, text: string) =>
    [...text].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true); // byteRate (= sampleRate * blockAlign(1))
  view.setUint16(32, 1, true); // blockAlign
  view.setUint16(34, 8, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  for (let i = 0; i < dataSize; i += 1) view.setUint8(44 + i, 128); // 8bit 무음 = 128

  let binary = '';
  new Uint8Array(buffer).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:audio/wav;base64,${btoa(binary)}`;
}

// unlock 에 필요한 silent clip (모듈 로드 시 1회 생성)
const SILENT_CLIP = makeSilentWavDataUri();

interface AudioPlayerContextValue {
  /** 현재 오디오가 재생 중인지. */
  isPlaying: boolean;
  unlock: () => void;
  play: (src: string) => Promise<void>;
  stop: () => void;
  /** 재생 종료(ended) 구독. 해제 함수를 반환한다. */
  onEnded: (handler: () => void) => () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function useAudioPlayer() {
  const context = use(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // playing/pause/ended 로 재생 중 여부를 추적한다.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlaying = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handleStop);
    audio.addEventListener('ended', handleStop);
    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handleStop);
      audio.removeEventListener('ended', handleStop);
    };
  }, []);

  const unlock = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = SILENT_CLIP;
    audio.play().catch(() => {});
  };

  const play = (src: string) => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject(new Error('Audio player not initialized'));
    if (audio.src !== src) {
      audio.src = src;
    }
    audio.currentTime = 0;
    return audio.play();
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const onEnded = (handler: () => void) => {
    const audio = audioRef.current;
    if (!audio) return () => {};
    audio.addEventListener('ended', handler);
    return () => audio.removeEventListener('ended', handler);
  };

  return (
    <AudioPlayerContext value={{ isPlaying, unlock, play, stop, onEnded }}>
      {children}
      <audio ref={audioRef} className="hidden" />
    </AudioPlayerContext>
  );
}
