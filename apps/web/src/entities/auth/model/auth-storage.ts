const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
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
