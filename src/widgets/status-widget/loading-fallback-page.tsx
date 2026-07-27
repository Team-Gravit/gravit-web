import LoadingFallbackAnimate from '@/shared/assets/_images/gif/loading-mascot-animate.gif';

import StatusPageLayout from './status-page-layout';
function LoadingFallbackPage() {
  return (
    <StatusPageLayout
      icon={
        <div className="size-[330px] md:size-[400px] relative">
          <img
            src={LoadingFallbackAnimate}
            alt="로딩중"
            className="w-full absolute -top-15 md:-top-25"
          />
        </div>
      }
      title="로딩중..."
      description={<>시즌은 매주 월요일 자정에 초기화돼요.</>}
    />
  );
}

export default LoadingFallbackPage;
