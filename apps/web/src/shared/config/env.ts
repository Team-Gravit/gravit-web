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
