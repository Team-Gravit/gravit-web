import { createFileRoute } from '@tanstack/react-router';

import SocialLoginButton from '@/features/login/ui/social-login-button';
import GoogleLogo from '@/shared/assets/_images/google.png';
import KakaoLogo from '@/shared/assets/_images/kakao.png';
import EmptySymbolLogoImage from '@/shared/assets/_images/logo/empty-symbol-logo.png';
import FillSymbolLogoImage from '@/shared/assets/_images/logo/fill-symbol-logo.png';
import NaverLogo from '@/shared/assets/_images/naver.png';
import EntryLayout from '@/shared/ui/layout/entry-layout';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const OAUTH_PROVIDERS = [
  { provider: 'google', imageSrc: GoogleLogo },
  { provider: 'kakao', imageSrc: KakaoLogo },
  { provider: 'naver', imageSrc: NaverLogo },
] as const;

function RouteComponent() {
  return (
    <div className="h-svh max-w-[430px] md:max-w-full">
      <EntryLayout>
        <div className="max-w-[630px] w-full bg-white rounded-xl md:flex md:flex-col md:items-center md:justify-center md:py-[45px] md:px-[72px] md:text-center">
          <div className="mb-[104px] md:mb-5 space-y-2.5">
            <picture>
              <source media="(max-width: 768px)" srcSet={EmptySymbolLogoImage} />
              <img src={FillSymbolLogoImage} className="size-18 mr-auto md:mx-auto mb-5" />
            </picture>
            <h1 className="text-heading1 md:text-title1 text-text-1 mb-3">
              교육행성에 어서 오세요. <br /> Gravit!
            </h1>
            <p className="text-body1-normal md:text-heading2 text-text-3 md:text-text-4">
              회원 서비스 이용을 위해 로그인 해주세요.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            {OAUTH_PROVIDERS.map((provider) => (
              <SocialLoginButton
                logoSrc={provider.imageSrc}
                provider={provider.provider}
                key={provider.provider}
              />
            ))}
          </div>
        </div>
      </EntryLayout>
    </div>
  );
}
