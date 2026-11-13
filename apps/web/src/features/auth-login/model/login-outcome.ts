import type { LoginResponse } from '@/shared/api/generated/model';
import { readWithdrawnAccountError } from '@/entities/user';

/** 서버 문구는 사용자용인지 확인되지 않았고 SDK 오류에는 서버 문구가 없어, 실패 안내를 통일한다. */
export const LOGIN_FAILED_MESSAGE = '로그인에 실패했습니다. 다시 시도해 주세요.';

/** 앱이 이 로그인을 처리하지 못할 때의 안내. 사용자가 할 수 있는 조치는 앱 업데이트뿐이다. */
export const LOGIN_UNSUPPORTED_MESSAGE =
  '해당 로그인을 사용할 수 없습니다. 앱을 업데이트 해주세요.';

/**
 * 로그인 성공 결과 중 이동 판정에 쓰는 값. 앱(`LoginResponse`)과 웹(`WebLoginResponse`) 응답이 모두 갖는다.
 */
export type LoginSuccess = Pick<LoginResponse, 'isOnboarded'>;

/**
 * 로그인 성공 후 갈 곳. 콜백·네이티브 두 진입 경로가 같은 판정을 쓴다.
 */
export function resolveLoginDestination({ isOnboarded }: LoginSuccess): '/main' | '/onboarding' {
  return isOnboarded ? '/main' : '/onboarding';
}

/** 탈퇴 계정 응답이면 복구에 쓸 providerId를, 아니면 `null`을 반환한다. */
export function readWithdrawnProviderId(error: unknown): string | null {
  // 로그인 응답의 탈퇴 계정 오류는 message에 복구에 쓸 providerId를 담는다.
  const withdrawnError = readWithdrawnAccountError(error);

  if (!withdrawnError || typeof withdrawnError.message !== 'string') {
    return null;
  }

  return withdrawnError.message;
}
