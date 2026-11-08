import type { LoginUrlResponse } from '@/shared/api/generated/model';
import { authorizeUrl } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { getOauthDest } from '@/shared/config';

import type { LoginProvider } from '../model/login-providers';

/**
 * provider의 인가 페이지 URL과 이번 로그인 시도의 `state`를 서버에서 받아 온다. (기준선 D1)
 * `state`는 1회용이고 10분 뒤 만료된다.
 */
export function getLoginUrl(provider: LoginProvider): Promise<LoginUrlResponse> {
  return authorizeUrl(provider, { dest: getOauthDest() });
}
