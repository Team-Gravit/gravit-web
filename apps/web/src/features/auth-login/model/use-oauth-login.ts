import { useMutation } from '@tanstack/react-query';

import { getLoginUrl } from '../api/get-login-url';
import type { LoginProvider } from './login-providers';

/** 선택한 소셜 로그인 제공자의 인가 URL을 조회하고, 성공하면 해당 주소로 이동한다. */
export function useOauthLogin() {
  return useMutation({
    mutationFn: (provider: LoginProvider) => getLoginUrl(provider),
    onSuccess: (loginUrl) => {
      // 외부 인증 페이지를 열기 위해 브라우저의 현재 문서를 전환한다.
      window.location.href = loginUrl;
    },
  });
}
