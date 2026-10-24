/** 음성 답변 녹음 제한 시간(ms). 기획이 바꾸는 관리 포인트. */
export const MAX_RECORDING_MS = 120_000;

/** 최소 녹음 시간(ms). 이 시간 전에는 답변 완료를 무시한다(너무 짧은 녹음 방지). 기획이 바꾸는 관리 포인트. */
export const MIN_RECORDING_MS = 3_000;

/** 세션 문항 수. 서버가 동적으로 바꾸지 않는 고정값(1..N). 제출은 전 문항을 보내야 한다. */
export const INTERVIEW_QUESTION_COUNT = 5;

/** INTERVIEW_4025(세션 취소됨) 안내 문구. 서버 메시지가 없을 때의 fallback. */
export const ABANDONED_SESSION_MESSAGE = '중단된 면접 세션입니다';
