import { configureAuth } from '@/shared/api';

import {
  clearStoredTokens,
  readStoredAccessToken,
  writeStoredTokens,
  type SessionTokens,
} from './auth-storage';
import { useAuthStore } from './auth-store';

/**
 * 세션 계약 — 모든 로그인 경로가 이 함수들만 쓴다.
 *
 * 토큰을 얻는 방법은 웹 리다이렉트와 네이티브 SDK로 갈리지만, 세션을 만드는 방법이 하나여야
 * 인증 게이트가 경로마다 갈라지지 않는다. 저장소를 직접 다루는 코드를 새로 만들지 않는다.
 */

export function setSession(tokens: SessionTokens): void {
  writeStoredTokens(tokens);
  useAuthStore.getState().setToken(tokens.accessToken);
}

export function getSessionToken(): string | null {
  // store에 토큰이 없으면 localStorage를 읽어, 초기 복원 전 요청에도 저장된 토큰을 전달한다.
  // 이 함수는 복원 완료를 기다리거나 토큰의 유효성을 검사하지 않는다.
  return useAuthStore.getState().accessToken ?? readStoredAccessToken();
}

export function clearSession(): void {
  clearStoredTokens();
  useAuthStore.getState().clearToken();
}

/** 저장소에 남아 있는 토큰으로 세션을 되살린다. 앱 부팅 시 한 번 호출한다. */
export function restoreSession(): void {
  const accessToken = readStoredAccessToken();

  if (!accessToken) {
    useAuthStore.getState().finishRestore();
    return;
  }

  useAuthStore.getState().setToken(accessToken);
}

// shared/api가 entities/auth를 직접 참조하지 않도록 토큰 조회와 세션 삭제 함수를 전달한다.
// 이 모듈을 불러올 때 연결해 별도 초기화 호출의 누락을 방지한다.
// 연결은 모듈 평가 시 이루어지며, 이 시점에 토큰을 읽거나 세션을 삭제하지는 않는다.
configureAuth({
  readAuthToken: getSessionToken,
  onUnauthorized: clearSession,
});
