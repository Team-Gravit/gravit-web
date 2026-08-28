type AuthTokenReader = () => string | null;
type UnauthorizedHandler = () => void;

let readAuthToken: AuthTokenReader = () => null;
let handleUnauthorized: UnauthorizedHandler = () => {};

/** 세션 계층이 저장 방식에 대한 의존성을 shared/api에 주입한다. */
export function configureAuth(config: {
  readAuthToken: AuthTokenReader;
  onUnauthorized: UnauthorizedHandler;
}): void {
  readAuthToken = config.readAuthToken;
  handleUnauthorized = config.onUnauthorized;
}

export function getAuthToken(): string | null {
  return readAuthToken();
}

export function notifyUnauthorized(): void {
  handleUnauthorized();
}
