import { useRef, useState } from 'react';

import { MAX_RECORDING_MS } from '@/entities/interview-session';

interface UseRecordingProps {
  onStop?: (blob: Blob) => void;
  onStart?: () => void;
}

const MIME_CANDIDATES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/mpeg'];
const pickMimeType = () => MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';

export function useRecording({ onStop, onStart }: UseRecordingProps) {
  const recordRef = useRef<MediaRecorder | null>(null);
  const chuncksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // getUserMedia await 틈의 중복 start(자동녹음 + 버튼 클릭 등)를 막는 동기 가드.
  const isStartingRef = useRef(false);

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const stopRecording = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const recorder = recordRef.current;

      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        const blob = new Blob(chuncksRef.current, { type: recorder.mimeType });
        onStop?.(blob); // 수동·자동(최대 시간) 정지 모두 이 경로를 거친다
        resolve(blob);
      };

      recorder.stop();
    });

  const startRecording = async () => {
    // 이미 녹음 중이거나 시작 처리 중이면 무시한다. recordRef 는 await 뒤에야 세팅되므로
    // getUserMedia 대기 틈에 들어온 중복 호출은 isStartingRef(동기 플래그)로 막는다.
    if (recordRef.current?.state === 'recording' || isStartingRef.current) {
      return;
    }
    isStartingRef.current = true;

    // 남아있는 타이머가 있으면 먼저 정리한다(인터벌 중복 방지).
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recordRef.current = recorder;
      chuncksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chuncksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
      onStart?.();

      // Date 차이로 경과시간을 갱신하고, 최대 시간에 도달하면 자동 정지한다.
      const startedAt = Date.now();
      setElapsedMs(0);
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt;
        setElapsedMs(elapsed);
        if (elapsed >= MAX_RECORDING_MS) stopRecording();
      }, 250);
    } finally {
      // 성공 시엔 이후 recordRef 가드가 맡고, 실패(권한 거부 등)해도 재시도할 수 있게 푼다.
      isStartingRef.current = false;
    }
  };

  return {
    isRecording,
    elapsedMs,
    startRecording,
    stopRecording,
  };
}
