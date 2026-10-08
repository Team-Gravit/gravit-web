import AccountRecoveryMascot from '@/shared/assets/_images/account-recovery-mascot.png';
import { Button } from '@/shared/ui/button/Button';

import StatusPageLayout from './status-page-layout';
function AccountRecoveryPage() {
  return (
    <StatusPageLayout
      icon={
        <img
          src={AccountRecoveryMascot}
          alt="웃고있는 마스코트 이미지"
          className="w-[165px] h-fit md:size-auto"
        />
      }
      title="돌아오신 것을 환영해요!"
    >
      <Button
        className="text-main-1 flex-1 h-12 bg-white md:h-[54px] md:text-headline2"
        variant={'strokeGray'}
        type="button"
      >
        취소하기
      </Button>

      <Button className="block flex-1 h-12 md:h-[54px] md:text-headline2">복구하기</Button>
    </StatusPageLayout>
  );
}

export default AccountRecoveryPage;
