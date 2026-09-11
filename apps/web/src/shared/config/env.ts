/**
 * OAuth 리다이렉트 목적지를 읽는다.
 *
 * 서버는 이 값으로 등록된 redirect_uri를 고른다. 인가 URL 조회와 코드 교환에서 같은 값을
 * 보내야 한다. 배포는 브랜치로 갈리고 빌드 명령은 같으므로 빌드 모드로는 구분할 수 없다.
 *
 * 상수가 아니라 함수인 이유: 모듈 평가 시점에 읽으면 값을 바꿔 검증할 때 모듈 그래프를
 * 통째로 다시 불러와야 한다. 빌드 시 값이 고정되므로 호출마다 읽어도 결과는 같다.
 */
export function getOauthDest(): string {
  return import.meta.env.VITE_OAUTH_DEST;
}

/**
 * API 요청의 baseURL을 읽는다.
 *
 * 개발 서버에서 `VITE_API_PROXY=true`면 빈 문자열을 돌려준다. 생성 API 경로가 이미 `/api/v1/...`로
 * 시작하므로 요청이 same-origin 상대 경로로 나가고, `vite.config.ts`의 `/api` 프록시가 백엔드로
 * 넘긴다. 프록시는 dev 서버에만 있으므로 빌드(`vite build` · `vite preview`)에서는 스위치를 무시한다.
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.DEV && import.meta.env.VITE_API_PROXY === 'true') {
    return '';
  }

  return import.meta.env.VITE_API_BASE_URL;
}
