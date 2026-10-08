import { authorizeUrl } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { getOauthDest } from '@/shared/config';

import type { LoginProvider } from '../model/login-providers';

/** provider의 인가 페이지 URL을 서버에서 받아 온다. (기준선 D1) */
export async function getLoginUrl(provider: LoginProvider): Promise<string> {
  const response = await authorizeUrl(provider, { dest: getOauthDest() });

  return response.loginUrl;
}
