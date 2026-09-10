import { authorizeUrl } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { getOauthDest } from '@/shared/config';

export type LoginProvider = 'google' | 'kakao' | 'naver';

const LOGIN_PROVIDERS: readonly LoginProvider[] = ['google', 'kakao', 'naver'];

/** 라우트 파라미터처럼 검증되지 않은 문자열이 지원하는 provider 인지 확인한다. */
export function isLoginProvider(value: string): value is LoginProvider {
  return LOGIN_PROVIDERS.includes(value as LoginProvider);
}

/** provider의 인가 페이지 URL을 서버에서 받아 온다. (기준선 D1) */
export async function getLoginUrl(provider: LoginProvider): Promise<string> {
  const response = await authorizeUrl(provider, { dest: getOauthDest() });

  return response.loginUrl;
}
