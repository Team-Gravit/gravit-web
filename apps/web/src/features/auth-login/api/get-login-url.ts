import { authorizeUrl } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { OAUTH_DEST } from '@/shared/config';

export type LoginProvider = 'google' | 'kakao' | 'naver';

/** provider의 인가 페이지 URL을 서버에서 받아 온다. (기준선 D1) */
export async function getLoginUrl(provider: LoginProvider): Promise<string> {
  const response = await authorizeUrl(provider, { dest: OAUTH_DEST });

  return response.loginUrl;
}
