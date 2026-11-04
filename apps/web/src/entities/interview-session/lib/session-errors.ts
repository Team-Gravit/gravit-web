// 세션 액션 API(409) 에러 판별. 생성 타입에 묶이지 않도록 필요한 형태만 좁게 본다.
type ApiErrorShape = {
  response?: { data?: { error?: string; message?: unknown } };
};

/**
 * INTERVIEW_4025 — 다른 탭·기기에서 새 세션이 생겨 이 세션이 이미 취소(ABANDONED)됨.
 * 진행 중 세션만 가능한 액션(submit·transcription·audio-uploads·abandon)에서 발생한다. → 홈으로 이동.
 */
export function isAbandonedSessionError(error: unknown): boolean {
  return (error as ApiErrorShape)?.response?.data?.error === 'INTERVIEW_4025';
}

/**
 * INTERVIEW_4026 — 이 세션이 이미 제출됨(GRADING/GRADING_FAILED/COMPLETED).
 * 멀티탭에서 다른 탭이 먼저 제출한 경우 등. → 결과 페이지에서 status 확인 후 리포트/채점대기로.
 */
export function isSubmittedSessionError(error: unknown): boolean {
  return (error as ApiErrorShape)?.response?.data?.error === 'INTERVIEW_4026';
}

/** 서버가 내려준 에러 메시지(문자열일 때만). 없으면 undefined. */
export function getServerErrorMessage(error: unknown): string | undefined {
  const message = (error as ApiErrorShape)?.response?.data?.message;
  return typeof message === 'string' ? message : undefined;
}

const UNEXPECTED_ERROR_MESSAGE = '예기치 못한 오류가 발생했습니다.';

/** 채점 상태 조회 에러의 안내 문구. 4003·4004는 서버 메시지, 그 외는 기본 문구. */
export function getGradingErrorMessage(error: unknown): string {
  const code = (error as ApiErrorShape)?.response?.data?.error;
  if (code === 'INTERVIEW_4003' || code === 'INTERVIEW_4004') {
    return getServerErrorMessage(error) ?? UNEXPECTED_ERROR_MESSAGE;
  }
  return UNEXPECTED_ERROR_MESSAGE;
}
