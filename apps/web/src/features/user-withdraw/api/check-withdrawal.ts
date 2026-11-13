import { getUser } from '@/shared/api/generated/user-api/user-api';
import { isWithdrawnAccountError } from '@/entities/user';

export type WithdrawalState = 'withdrawn' | 'active';

/**
 * 지금 세션의 계정이 탈퇴 확정됐는지 서버에 묻는다.
 *
 * 탈퇴 확정은 메일 앱의 별도 브라우저에서 일어나 이 화면은 결과를 알 수 없다. 사용자 조회가
 * 탈퇴 계정 응답(`USER_423`)이면 확정된 것으로 본다. 그 밖의 실패는 판단할 수 없어 다시 던진다.
 */
export async function checkWithdrawalState(): Promise<WithdrawalState> {
  try {
    await getUser();
    return 'active';
  } catch (error) {
    if (isWithdrawnAccountError(error)) {
      return 'withdrawn';
    }
    throw error;
  }
}
