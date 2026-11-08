import { configureAuth, isNativeApp, isRefreshRejected, refreshAccessToken } from '@/shared/api';

import {
  clearSessionHint,
  clearStoredTokens,
  hasSessionHint,
  hasStoredTokens,
  readStoredAccessToken,
  readStoredRefreshToken,
  writeSessionHint,
  writeStoredAccessToken,
  writeStoredTokens,
  type SessionTokens,
} from './auth-storage';
import { useAuthStore } from './auth-store';

/**
 * 세션 계약 — 모든 로그인 경로가 이 함수들만 쓴다.
 *
 * 토큰을 얻는 방법은 웹 리다이렉트와 네이티브 SDK로 갈리지만, 세션을 만드는 방법이 하나여야
 * 인증 게이트가 경로마다 갈라지지 않는다. 저장소를 직접 다루는 코드를 새로 만들지 않는다.
 *
 * 웹은 accessToken을 메모리에만 두고 refreshToken은 서버의 HttpOnly 쿠키가 들고 있다.
 * 앱(WebView)은 재실행 후 복원을 위해 두 토큰을 저장소에 둔다. (FEAT-080 ADR-1)
 */

/** 복원 결과. `failed`는 일시 장애라 세션 힌트를 남기고, 다음 호출에서 다시 시도한다. */
export type RestoreResult = 'restored' | 'none' | 'failed';

/** 앱 로그인 — 응답 본문의 두 토큰을 저장한다. */
export function setSession(tokens: SessionTokens): void {
  writeStoredTokens(tokens);
  useAuthStore.getState().setToken(tokens.accessToken);
}

/** 웹 로그인 — refreshToken은 쿠키로 받았으므로 accessToken만 메모리에 두고 힌트를 남긴다. */
export function setWebSession(accessToken: string): void {
  writeSessionHint();
  useAuthStore.getState().setToken(accessToken);
}

export function getSessionToken(): string | null {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    return accessToken;
  }

  // 웹은 메모리만 본다. 토큰을 저장소에 두지 않는다.
  if (!isNativeApp()) {
    return null;
  }

  // 앱은 초기 복원 전 요청에도 저장된 토큰을 전달한다.
  // 이 함수는 복원 완료를 기다리거나 토큰의 유효성을 검사하지 않는다.
  return readStoredAccessToken();
}

export function clearSession(): void {
  clearStoredTokens();
  clearSessionHint();
  useAuthStore.getState().clearToken();
}

let pendingRestore: Promise<RestoreResult> | null = null;

/**
 * 부팅 때 세션을 되살린다. 여러 곳에서 불러도 진행 중인 복원 하나를 함께 기다린다.
 *
 * 인증 판단을 하는 라우트는 이 Promise가 끝난 뒤에 판단한다. 웹은 재발급 응답을 기다려야 하기 때문이다.
 * 거절하지 않는다. 실패는 `failed`로 돌려준다.
 */
export function restoreSession(): Promise<RestoreResult> {
  if (useAuthStore.getState().accessToken) {
    return Promise.resolve('restored');
  }

  if (isNativeApp()) {
    return Promise.resolve(restoreStoredSession());
  }

  pendingRestore ??= restoreWebSession().finally(() => {
    pendingRestore = null;
  });

  return pendingRestore;
}

function restoreStoredSession(): RestoreResult {
  const accessToken = readStoredAccessToken();

  if (!accessToken) {
    useAuthStore.getState().finishRestore();
    return 'none';
  }

  useAuthStore.getState().setToken(accessToken);
  return 'restored';
}

async function restoreWebSession(): Promise<RestoreResult> {
  // 쿠키 전환 전에 저장한 토큰이다. 재발급은 쿠키를 새로 발급하지 않아 이 값으로는 쿠키 방식으로 넘어갈 수 없다.
  // 지우고 다시 로그인하게 한다. (FEAT-080 ADR-4)
  if (hasStoredTokens()) {
    clearSession();
    return 'none';
  }

  if (!hasSessionHint()) {
    useAuthStore.getState().finishRestore();
    return 'none';
  }

  try {
    // 성공하면 onTokenRefreshed 주입을 거쳐 store에 토큰이 실린다.
    await refreshAccessToken();
    return 'restored';
  } catch (error) {
    if (isRefreshRejected(error)) {
      clearSession();
      return 'none';
    }

    useAuthStore.getState().finishRestore();
    return 'failed';
  }
}

/** 재발급으로 받은 accessToken만 반영한다. refreshToken은 그대로 둔다. (기준선 A3) */
function applyRefreshedToken(accessToken: string): void {
  if (isNativeApp()) {
    writeStoredAccessToken(accessToken);
  }

  useAuthStore.getState().setToken(accessToken);
}

// 웹은 본문에 refreshToken을 싣지 않는다. 쿠키가 대신 전송된다.
function readSessionRefreshToken(): string | null {
  return isNativeApp() ? readStoredRefreshToken() : null;
}

// shared/api가 entities/auth를 직접 참조하지 않도록 토큰 조회와 세션 삭제 함수를 전달한다.
// 이 모듈을 불러올 때 연결해 별도 초기화 호출의 누락을 방지한다.
// 연결은 모듈 평가 시 이루어지며, 이 시점에 토큰을 읽거나 세션을 삭제하지는 않는다.
configureAuth({
  readAuthToken: getSessionToken,
  readRefreshToken: readSessionRefreshToken,
  onUnauthorized: clearSession,
  onTokenRefreshed: applyRefreshedToken,
});
