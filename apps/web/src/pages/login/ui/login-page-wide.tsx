import { Link } from '@tanstack/react-router';

import { LOGIN_PROVIDERS, SocialLoginButton } from '@/features/auth-login';
import { SpaceBackground } from '@/shared/ui/layout';
import { GravitLogo } from '@/shared/ui/logo';

/** 넓은 화면 로그인 화면. 우주 배경 위에 흰 카드를 가운데 놓는다. */
export function LoginPageWide() {
  return (
    <SpaceBackground className="flex items-center justify-center">
      <section className="flex w-[630px] flex-col items-center rounded-16 bg-white px-18 pt-22 pb-15">
        {/* 화면을 대표하는 것이 워드마크라 제목이 글자로 보이지 않는다. 이름은 남긴다. */}
        <h1 className="sr-only">로그인</h1>

        <GravitLogo variant={'mono'} className="h-15 w-auto text-[#9b00cf]" />
        <p className="mt-6 text-heading2 text-text-2">그래빗과 함께 CS 지식을 마스터해요!</p>

        <div className="mt-13 flex w-full flex-col gap-4">
          {LOGIN_PROVIDERS.map((provider) => (
            <SocialLoginButton key={provider} provider={provider} size="wide" />
          ))}
        </div>

        <nav className="mt-6 flex items-center gap-4 text-caption1 text-text-4">
          <Link to="/privacy">개인정보 처리방침</Link>
          <span aria-hidden className="h-3 w-px bg-divider-1" />
          <Link to="/terms">이용약관</Link>
        </nav>
      </section>
    </SpaceBackground>
  );
}
