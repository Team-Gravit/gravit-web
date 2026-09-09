/**
 * OAuth 리다이렉트 목적지.
 *
 * 서버는 이 값으로 등록된 redirect_uri를 고른다. 인가 URL 조회와 코드 교환에서 같은 값을
 * 보내야 한다. 배포는 브랜치로 갈리고 빌드 명령은 같으므로 빌드 모드로는 구분할 수 없다.
 */
export const OAUTH_DEST = import.meta.env.VITE_OAUTH_DEST;
