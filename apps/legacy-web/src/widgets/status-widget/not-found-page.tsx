import { useRouter } from '@tanstack/react-router';

import NotFoundMascot from '@/shared/assets/_images/not-found-mascot.png';
import { Button } from '@/shared/ui/button/Button';
import { LinkButton } from '@/shared/ui/button/link-button';

import StatusPageLayout from './status-page-layout';

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <StatusPageLayout
      icon={
        <img
          src={NotFoundMascot}
          alt="페이지를 찾을 수 없습니다"
          className="size-[175px] md:size-100"
        />
      }
      title="페이지를 찾을 수 없어요."
      description={
        <>
          잘못된 주소이거나 삭제된 페이지입니다.
          <br />
          주소를 확인하시거나 홈으로 이동해 주세요.
        </>
      }
    >
      <Button
        className="text-main-1 flex-1 h-12 bg-white md:h-[54px] md:text-headline2"
        variant={'strokeGray'}
        type="button"
        onClick={handleGoBack}
      >
        돌아가기
      </Button>

      <LinkButton to="/main" className="block flex-1 h-12 md:h-[54px] md:text-headline2">
        메인으로
      </LinkButton>
    </StatusPageLayout>
  );
}
