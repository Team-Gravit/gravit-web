import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import {
  getAuthToken,
  getRefreshToken,
  notifyTokenRefreshed,
  notifyUnauthorized,
} from '@/shared/api';
import {
  installNativeBridgeStub,
  uninstallNativeBridgeStub,
} from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';

import { hasSessionHint, readStoredAccessToken, readStoredRefreshToken } from './auth-storage';
import { useAuthStore } from './auth-store';
import {
  clearSession,
  getSessionToken,
  restoreSession,
  setSession,
  setWebSession,
} from './session-contract';

const REISSUE_URL = '*/api/v1/auth/reissue';

/** 재발급 요청을 세고, 지정한 응답을 돌려준다. */
function recordReissue(respond: () => Response) {
  const requests: string[] = [];
  server.use(
    http.post(REISSUE_URL, async ({ request }) => {
      requests.push(await request.text());
      return respond();
    }),
  );
  return requests;
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

describe('웹 경로', () => {
  describe('setWebSession', () => {
    it('accessToken 은 store 에만 두고 저장소에는 힌트만 남긴다 (AC-7)', () => {
      setWebSession('tok_new');

      expect(useAuthStore.getState().accessToken).toBe('tok_new');
      expect(readStoredAccessToken()).toBeNull();
      expect(readStoredRefreshToken()).toBeNull();
      expect(hasSessionHint()).toBe(true);
    });
  });

  describe('getSessionToken', () => {
    it('저장소에 accessToken 이 있어도 읽지 않는다', () => {
      localStorage.setItem('accessToken', 'tok_old');

      expect(getSessionToken()).toBeNull();
    });
  });

  describe('restoreSession', () => {
    it('힌트가 없으면 재발급 요청 없이 none 이다 (AC-8)', async () => {
      const requests = recordReissue(() => HttpResponse.json({ accessToken: 'tok_new' }));

      await expect(restoreSession()).resolves.toBe('none');
      expect(requests).toHaveLength(0);
      expect(useAuthStore.getState().isRestored).toBe(true);
    });

    it('힌트가 있으면 본문 없이 재발급해 세션을 되살린다 (AC-9)', async () => {
      localStorage.setItem('hasSession', '1');
      const requests = recordReissue(() => HttpResponse.json({ accessToken: 'tok_new' }));

      await expect(restoreSession()).resolves.toBe('restored');
      expect(requests).toEqual(['']);
      expect(useAuthStore.getState().accessToken).toBe('tok_new');
      expect(readStoredAccessToken()).toBeNull();
    });

    it('동시에 여러 번 불러도 재발급은 한 번만 나간다', async () => {
      localStorage.setItem('hasSession', '1');
      const requests = recordReissue(() => HttpResponse.json({ accessToken: 'tok_new' }));

      const results = await Promise.all([restoreSession(), restoreSession(), restoreSession()]);

      expect(results).toEqual(['restored', 'restored', 'restored']);
      expect(requests).toHaveLength(1);
    });

    it('재발급이 4xx 면 힌트를 지우고 none 이다 (AC-10)', async () => {
      localStorage.setItem('hasSession', '1');
      recordReissue(() => new HttpResponse(null, { status: 401 }));

      await expect(restoreSession()).resolves.toBe('none');
      expect(hasSessionHint()).toBe(false);
      expect(useAuthStore.getState().accessToken).toBeNull();
    });

    it('재발급이 5xx 면 힌트를 남기고 failed 이며, 다시 부르면 재시도한다 (AC-11)', async () => {
      localStorage.setItem('hasSession', '1');
      const requests = recordReissue(() => new HttpResponse(null, { status: 500 }));

      await expect(restoreSession()).resolves.toBe('failed');
      expect(hasSessionHint()).toBe(true);

      await restoreSession();
      expect(requests).toHaveLength(2);
    });

    it('재발급이 네트워크 오류면 failed 이다 (AC-11)', async () => {
      localStorage.setItem('hasSession', '1');
      server.use(http.post(REISSUE_URL, () => HttpResponse.error()));

      await expect(restoreSession()).resolves.toBe('failed');
      expect(hasSessionHint()).toBe(true);
    });

    it('옛 토큰이 저장소에 있으면 지우고 재발급 없이 none 이다 (AC-12)', async () => {
      localStorage.setItem('accessToken', 'tok_old');
      localStorage.setItem('refreshToken', 'ref_old');
      const requests = recordReissue(() => HttpResponse.json({ accessToken: 'tok_new' }));

      await expect(restoreSession()).resolves.toBe('none');
      expect(requests).toHaveLength(0);
      expect(readStoredAccessToken()).toBeNull();
      expect(readStoredRefreshToken()).toBeNull();
    });

    it('이미 store 에 토큰이 있으면 요청 없이 restored 이다', async () => {
      setWebSession('tok_abc');
      const requests = recordReissue(() => HttpResponse.json({ accessToken: 'tok_new' }));

      await expect(restoreSession()).resolves.toBe('restored');
      expect(requests).toHaveLength(0);
    });
  });

  describe('clearSession', () => {
    it('store 토큰과 힌트를 지운다', () => {
      setWebSession('tok_abc');

      clearSession();

      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(hasSessionHint()).toBe(false);
    });
  });

  describe('HTTP 계층 주입', () => {
    it('getRefreshToken 은 저장소에 값이 있어도 null 이다 — 쿠키가 대신 간다', () => {
      localStorage.setItem('refreshToken', 'ref_old');

      expect(getRefreshToken()).toBeNull();
    });

    it('notifyTokenRefreshed 는 store 만 바꾸고 저장소에 쓰지 않는다', () => {
      setWebSession('tok_old');

      notifyTokenRefreshed('tok_new');

      expect(useAuthStore.getState().accessToken).toBe('tok_new');
      expect(readStoredAccessToken()).toBeNull();
    });

    it('notifyUnauthorized 를 호출하면 세션과 힌트가 비워진다', () => {
      setWebSession('tok_abc');

      notifyUnauthorized();

      expect(getAuthToken()).toBeNull();
      expect(hasSessionHint()).toBe(false);
    });
  });
});

describe('앱 경로', () => {
  beforeEach(() => {
    installNativeBridgeStub();
  });

  afterEach(() => {
    uninstallNativeBridgeStub();
  });

  describe('setSession', () => {
    it('두 토큰을 저장소에 저장하고 store 에 accessToken 을 싣는다 (AC-17)', () => {
      setSession({ accessToken: 'tok_new', refreshToken: 'ref_new' });

      expect(readStoredAccessToken()).toBe('tok_new');
      expect(readStoredRefreshToken()).toBe('ref_new');
      expect(useAuthStore.getState().accessToken).toBe('tok_new');
      expect(useAuthStore.getState().isRestored).toBe(true);
    });
  });

  describe('getSessionToken', () => {
    it('저장소에 accessToken 이 있으면 복원 전에도 그 값을 반환한다', () => {
      localStorage.setItem('accessToken', 'tok_abc');

      expect(getSessionToken()).toBe('tok_abc');
    });
  });

  describe('restoreSession', () => {
    it('저장 토큰으로 네트워크 없이 세션을 되살린다 (AC-18)', async () => {
      localStorage.setItem('accessToken', 'tok_abc');
      localStorage.setItem('refreshToken', 'ref_1');
      const requests = recordReissue(() => HttpResponse.json({ accessToken: 'tok_new' }));

      await expect(restoreSession()).resolves.toBe('restored');
      expect(requests).toHaveLength(0);
      expect(useAuthStore.getState().accessToken).toBe('tok_abc');
    });

    it('저장소가 비어 있으면 none 이고 isRestored 가 true 가 된다', async () => {
      await expect(restoreSession()).resolves.toBe('none');
      expect(useAuthStore.getState().isRestored).toBe(true);
    });
  });

  describe('clearSession', () => {
    it('두 토큰을 모두 지운다', () => {
      setSession({ accessToken: 'tok_abc', refreshToken: 'ref_1' });

      clearSession();

      expect(readStoredAccessToken()).toBeNull();
      expect(readStoredRefreshToken()).toBeNull();
      expect(useAuthStore.getState().accessToken).toBeNull();
    });
  });

  describe('재발급 주입', () => {
    it('getRefreshToken 이 저장소의 refreshToken 을 반환한다 (AC-19)', () => {
      setSession({ accessToken: 'tok_old', refreshToken: 'ref_1' });

      expect(getRefreshToken()).toBe('ref_1');
    });

    it('notifyTokenRefreshed 를 호출하면 accessToken 만 교체하고 refreshToken 은 유지한다', () => {
      setSession({ accessToken: 'tok_old', refreshToken: 'ref_1' });

      notifyTokenRefreshed('tok_new');

      expect(readStoredAccessToken()).toBe('tok_new');
      expect(readStoredRefreshToken()).toBe('ref_1');
      expect(useAuthStore.getState().accessToken).toBe('tok_new');
    });
  });
});
