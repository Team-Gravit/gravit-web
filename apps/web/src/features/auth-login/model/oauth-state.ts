import type { LoginProvider } from './login-providers';

/**
 * 로그인 CSRF 방지 — 이 브라우저가 시작한 로그인인지 확인한다. (FEAT-080 ADR-3)
 *
 * 서버는 `state`가 발급된 값인지만 본다. 공격자가 자기 계정으로 받은 `code`와 `state`를 링크로
 * 보내도 서버 검증은 통과하므로, 로그인을 시작할 때 저장한 값과 콜백 값을 웹이 비교한다.
 * 제공자 앱을 거쳐 새 탭으로 돌아와도 동작하도록 `sessionStorage`가 아니라 `localStorage`에 둔다.
 */

const STORAGE_KEY = 'pendingOauthState';

// 서버가 발급한 state의 유효 시간과 같다.
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

export interface PendingOauthState {
  provider: LoginProvider;
  state: string;
  createdAt: number;
}

interface OauthCallbackState {
  provider: LoginProvider;
  state: string | undefined;
}

/** 저장값과 콜백 값이 같은 로그인 시도인지 판정한다. 만료됐거나 제공자가 다르면 거절한다. */
export function isPendingStateMatched(
  pending: PendingOauthState | null,
  callback: OauthCallbackState,
  now: number,
): boolean {
  if (!pending || !callback.state) {
    return false;
  }

  if (now - pending.createdAt > OAUTH_STATE_TTL_MS) {
    return false;
  }

  return pending.provider === callback.provider && pending.state === callback.state;
}

export function savePendingOauthState(provider: LoginProvider, state: string): void {
  const pending: PendingOauthState = { provider, state, createdAt: Date.now() };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
}

/**
 * 콜백에 도착했을 때 한 번 부른다. 결과와 상관없이 저장값을 지운다 — state는 1회용이다.
 * `true`일 때만 코드 교환을 진행한다.
 */
export function consumePendingOauthState(callback: OauthCallbackState): boolean {
  const pending = readPendingOauthState();

  localStorage.removeItem(STORAGE_KEY);

  return isPendingStateMatched(pending, callback, Date.now());
}

function readPendingOauthState(): PendingOauthState | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingOauthState;
  } catch {
    // 손상된 값은 일치하지 않는 것으로 본다. 저장값은 호출부가 지운다.
    return null;
  }
}
