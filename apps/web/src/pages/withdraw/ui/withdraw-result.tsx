import WithdrawFailedMascot from './assets/withdraw-failed-mascot.webp';
import WithdrawSuccessMascot from './assets/withdraw-success-mascot.webp';
import { WithdrawStatusLayout } from './withdraw-status-layout';

interface WithdrawResultProps {
  status: 'success' | 'failed';
}

/**
 * 탈퇴 결과 화면(성공/실패). 메일 링크 확정(`confirm`) 결과에 따라 보여준다.
 */
export function WithdrawResult({ status }: WithdrawResultProps) {
  return (
    <WithdrawStatusLayout
      mascotSrc={status === 'success' ? WithdrawSuccessMascot : WithdrawFailedMascot}
      title={status === 'success' ? '탈퇴가 완료되었어요.' : '탈퇴에 실패했어요.'}
      description={
        <>
          7일 내에 복구 절차를 진행하지 않을 시, <br /> 계정과 데이터들이 모두 삭제됩니다.
        </>
      }
    />
  );
}
