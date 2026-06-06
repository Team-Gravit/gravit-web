import { api } from '@/shared/api';

export type LoginProvider = 'google' | 'kakao' | 'naver';

export async function getLoginUrl(provider: LoginProvider): Promise<string> {
	const dest = import.meta.env.MODE === "development" ? "local" : import.meta.env.VITE_OAUTH_DEST;

  const { data } = await api.public.oAuth.authorizeUrl(provider, dest);
  return data.loginUrl;
}
