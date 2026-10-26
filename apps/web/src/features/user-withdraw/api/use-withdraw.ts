import { useConfirm, useRequest } from '@/shared/api/generated/user-deletion-api/user-deletion-api';
import { getOauthDest } from '@/shared/config';

/**
 * 탈퇴 인증 메일 발송 요청. 「계속하기」에서 호출한다.
 * `dest`(삭제 확인 링크가 향할 프론트 환경)는 전송 계층 사정이라 호출부에 드러내지 않는다.
 */
export function useRequestWithdrawal(callbacks?: { onSuccess?: () => void; onError?: () => void }) {
  const { mutate, ...rest } = useRequest({ mutation: callbacks });

  return {
    ...rest,
    requestWithdrawal: () => mutate({ params: { dest: getOauthDest() } }),
  };
}

/**
 * 메일 인증 코드로 계정 삭제를 확정한다. 메일 링크 진입 페이지에서 호출한다.
 * 성공/실패 후 동작(로그아웃·이동)은 호출부가 콜백으로 주입한다.
 */
export function useConfirmWithdrawal(callbacks?: { onSuccess?: () => void; onError?: () => void }) {
  const { mutate, ...rest } = useConfirm({ mutation: callbacks });

  return {
    ...rest,
    confirmWithdrawal: (mailAuthCode: string) => mutate({ params: { mailAuthCode } }),
  };
}
