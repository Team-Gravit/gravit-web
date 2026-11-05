import { useNavigate } from '@tanstack/react-router';

import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { readWithdrawnProviderId, resolveLoginDestination } from '@/features/auth-login';

import { LoginPageNarrow } from './login-page-narrow';
import type { LoginPageVariantProps } from './login-page-variant-props';
import { LoginPageWide } from './login-page-wide';

// 두 시안은 배경·구조·문구가 서로 달라 Tailwind 반응형 클래스로 한 트리에 담기 어렵다.
// 그래서 이 화면만 뷰포트로 컴포넌트를 가른다. 크기·여백 차이는 계속 `md:` 로 처리한다.
export function LoginPage() {
  const isWide = useIsWideViewport();
  const navigate = useNavigate();

  // 앱 환경의 네이티브 로그인 결과. 웹 경로는 콜백 화면이 같은 판정으로 이동한다.
  // 두 시안 컴포넌트가 형제라 여기서 한 번만 만들어 내린다 — 각자 붙이면 판정이 갈라진다.
  const handleLoginSuccess: LoginPageVariantProps['onLoginSuccess'] = (response) => {
    navigate({ to: resolveLoginDestination(response), replace: true });
  };

  const handleLoginError: LoginPageVariantProps['onLoginError'] = (error) => {
    const providerId = readWithdrawnProviderId(error);

    if (providerId) {
      navigate({ to: '/restore', search: { providerId }, replace: true });
    }
  };

  const variantProps: LoginPageVariantProps = {
    onLoginSuccess: handleLoginSuccess,
    onLoginError: handleLoginError,
  };

  return isWide ? <LoginPageWide {...variantProps} /> : <LoginPageNarrow {...variantProps} />;
}
