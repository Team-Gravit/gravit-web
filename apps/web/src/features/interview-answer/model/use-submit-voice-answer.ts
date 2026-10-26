import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  ABANDONED_SESSION_MESSAGE,
  getServerErrorMessage,
  isAbandonedSessionError,
  isSubmittedSessionError,
  useInterviewSessionStore,
} from '@/entities/interview-session';
import { toast } from '@/shared/ui/toast';

import { requestTranscription } from '../api/request-transcription';
import { uploadAudio } from '../api/upload-audio';

/**
 * 녹음 Blob을 업로드하고 audioKey를 기록한 뒤 STT 변환을 요청한다.
 * 제출 후 흐름(다음 문항 이동 등)은 호출부가 mutate의 onSuccess로 결정한다.
 * sessionId·문항 번호는 제출 시점의 store 값을 읽어 stale 없이 처리한다.
 */
export function useSubmitVoiceAnswer() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (blob: Blob) => {
      const { sessionId, currentIndex, setAnswerAudioKey } = useInterviewSessionStore.getState();
      if (sessionId == null) {
        throw new Error('세션이 없습니다');
      }
      const displayOrder = currentIndex + 1;

      const audioKey = await uploadAudio(sessionId, displayOrder, blob);
      setAnswerAudioKey(displayOrder, audioKey);
      await requestTranscription(sessionId, { displayOrder, audioKey }); // STT 변환 요청(백그라운드)
    },
    // 멀티탭·기기에서 세션 상태가 바뀐 경우: 취소(4025)면 홈, 이미 제출(4026)이면 결과 페이지로.
    onError: (error) => {
      if (isAbandonedSessionError(error)) {
        toast(getServerErrorMessage(error) ?? ABANDONED_SESSION_MESSAGE);
        navigate({ to: '/interview' });
        return;
      }
      if (isSubmittedSessionError(error)) {
        const { sessionId } = useInterviewSessionStore.getState();
        if (sessionId != null) {
          navigate({
            to: '/interview/sessions/grading/$sessionId',
            params: { sessionId: String(sessionId) },
            replace: true,
          });
        }
      }
    },
  });
}
