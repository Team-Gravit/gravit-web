import type { SocialLoginButtonProps } from '@/features/auth-login';

/** 넓은·좁은 시안 컴포넌트가 공통으로 받는 것. 로그인 결과 처리는 `LoginPage`가 정한다. */
export type LoginPageVariantProps = Pick<SocialLoginButtonProps, 'onLoginSuccess' | 'onLoginError'>;
