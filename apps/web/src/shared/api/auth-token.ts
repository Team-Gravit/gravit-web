type AuthTokenReader = () => string | null;
type UnauthorizedHandler = () => void;
type TokenRefreshHandler = (accessToken: string) => void;

let readAuthToken: AuthTokenReader = () => null;
let readRefreshToken: AuthTokenReader = () => null;
let handleUnauthorized: UnauthorizedHandler = () => {};
let handleTokenRefreshed: TokenRefreshHandler = () => {};

export interface AuthConfig {
  readAuthToken: AuthTokenReader;
  readRefreshToken: AuthTokenReader;
  onUnauthorized: UnauthorizedHandler;
  onTokenRefreshed: TokenRefreshHandler;
}

/** 세션 계층이 저장 방식에 대한 의존성을 shared/api에 주입한다. */
export function configureAuth(config: AuthConfig): void {
  readAuthToken = config.readAuthToken;
  readRefreshToken = config.readRefreshToken;
  handleUnauthorized = config.onUnauthorized;
  handleTokenRefreshed = config.onTokenRefreshed;
}

export function getAuthToken(): string | null {
  return readAuthToken();
}

export function getRefreshToken(): string | null {
  return readRefreshToken();
}

export function notifyUnauthorized(): void {
  handleUnauthorized();
}

/** 재발급으로 accessToken만 바뀌었음을 알린다. refreshToken은 그대로 둔다. (기준선 A3) */
export function notifyTokenRefreshed(accessToken: string): void {
  handleTokenRefreshed(accessToken);
}
