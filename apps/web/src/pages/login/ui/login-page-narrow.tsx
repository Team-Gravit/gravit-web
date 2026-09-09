import { Link } from '@tanstack/react-router';

import { LOGIN_PROVIDERS, SocialLoginButton } from '@/features/auth-login';
import { PageHeader } from '@/shared/ui/layout';
import { GravitSymbol } from '@/shared/ui/logo';

/** 좁은 화면 로그인 화면. 상단바를 두고 버튼을 화면 아래쪽에 붙인다. */
export function LoginPageNarrow() {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <PageHeader title="로그인" />

      <main className="flex flex-1 flex-col px-4 pt-28 pb-10">
        <GravitSymbol className="w-18 text-main" />

        <h2 className="mt-5 text-heading1 text-text-1">
          교육행성에 어서 오세요.
          <br />
          Gravit!
        </h2>
        <p className="mt-3 text-body1-normal text-text-3">
          회원 서비스 이용을 위해 로그인 해주세요.
        </p>

        <div className="mt-auto flex flex-col gap-3">
          {LOGIN_PROVIDERS.map((provider) => (
            <SocialLoginButton key={provider} provider={provider} />
          ))}
        </div>

        <nav className="mt-3 flex items-center justify-center gap-4 text-caption1 text-text-4">
          <Link to="/privacy">개인정보 처리방침</Link>
          <span aria-hidden className="h-3 w-px bg-divider-1" />
          <Link to="/terms">이용약관</Link>
        </nav>
      </main>
    </div>
  );
}
