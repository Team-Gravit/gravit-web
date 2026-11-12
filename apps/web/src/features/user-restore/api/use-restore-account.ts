import { isAxiosError } from 'axios';

import { useRestoreUser } from '@/shared/api/generated/user-api/user-api';

const RESTORE_FAILURE_MESSAGE = '복구에 실패했습니다.';
// USER_4041 일 때만 서버가 내려준 안내 문구를 그대로 노출한다. 그 외 에러는 기본 실패 문구를 쓴다.
const RESTORE_GUIDED_ERROR = 'USER_4041';

/** 복구 실패 에러에서 사용자에게 보여줄 문구를 고른다. 서버 안내가 있으면 그것을, 없으면 기본 문구를. */
function resolveRestoreErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return RESTORE_FAILURE_MESSAGE;
  }

  const body = error.response?.data as { error?: string; message?: unknown } | undefined;

  if (body?.error === RESTORE_GUIDED_ERROR && typeof body.message === 'string') {
    return body.message;
  }

  return RESTORE_FAILURE_MESSAGE;
}

/**
 * 소프트 삭제된 계정을 복구한다. 복구 페이지(비로그인 진입)에서 호출한다.
 * 성공 후 이동과 실패 문구 표시(토스트)는 UI 레이어가 콜백으로 결정한다.
 * `onError` 는 이미 해석된 사용자 노출 문구를 받는다.
 */
export function useRestoreAccount(callbacks?: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}) {
  const { mutate, ...rest } = useRestoreUser({
    mutation: {
      onSuccess: callbacks?.onSuccess,
      onError: (error) => callbacks?.onError?.(resolveRestoreErrorMessage(error)),
    },
  });

  return {
    ...rest,
    restoreAccount: (providerId: string) => mutate({ params: { providerId } }),
  };
}
