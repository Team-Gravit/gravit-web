const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  sessionHint: 'hasSession',
} as const;

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export function readStoredAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function readStoredRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function writeStoredTokens({ accessToken, refreshToken }: SessionTokens): void {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

/** 재발급은 accessToken만 교체하고 refreshToken은 그대로 둔다. (기준선 A3) */
export function writeStoredAccessToken(accessToken: string): void {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
}

export function clearStoredTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
}

export function hasStoredTokens(): boolean {
  return readStoredAccessToken() !== null || readStoredRefreshToken() !== null;
}

// 세션 힌트 — 이 브라우저가 로그인했었다는 표시일 뿐 토큰이 아니다.
// JS는 HttpOnly 쿠키의 유무를 알 수 없어, 힌트가 있을 때만 부팅 재발급을 시도한다. (FEAT-080 ADR-2)
export function hasSessionHint(): boolean {
  return localStorage.getItem(STORAGE_KEYS.sessionHint) !== null;
}

export function writeSessionHint(): void {
  localStorage.setItem(STORAGE_KEYS.sessionHint, '1');
}

export function clearSessionHint(): void {
  localStorage.removeItem(STORAGE_KEYS.sessionHint);
}
