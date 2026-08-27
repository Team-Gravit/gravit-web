import FailedWithdrawMascot from '@/shared/assets/_images/failed-withdraw-mascot.png';
import SuccessWithdrawMascot from '@/shared/assets/_images/success-withdraw-mascot.png';

import StatusPageLayout from './status-page-layout';

interface WithdrawResultPageProps {
  status: 'failed' | 'success';
}

const WithdrawStatusConfig = {
  failed: {
    imageSrc: FailedWithdrawMascot,
    title: '탈퇴를 실패했어요',
    description: (
      <>
        가입하신 이메일로 안내 메일을 발송했습니다.
        <br /> 안내에 따라 남은 절차를 완료해 주세요.
      </>
    ),
  },
  success: {
    imageSrc: SuccessWithdrawMascot,
    title: '탈퇴를 완료했어요',
    description: (
      <>
        7일 내 복구 절차를 진행하지 않을 시,
        <br />
        계정과 데이터들이 모두 삭제됩니다.
      </>
    ),
  },
} as const;

function WithdrawResultPage({ status }: WithdrawResultPageProps) {
  return (
    <StatusPageLayout
      icon={
        <img
          src={WithdrawStatusConfig[status].imageSrc}
          alt={WithdrawStatusConfig[status].title}
          className="w-[143px] h-fit md:size-auto"
        />
      }
      title={WithdrawStatusConfig[status].title}
      description={WithdrawStatusConfig[status].description}
    />
  );
}

export default WithdrawResultPage;
