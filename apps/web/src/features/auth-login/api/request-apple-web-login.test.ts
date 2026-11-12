import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { requestAppleWebCode } from './request-apple-web-login';

const init = vi.fn();
const signIn = vi.fn();

beforeEach(() => {
  vi.stubEnv('VITE_APPLE_CLIENT_ID', 'kr.example.web');
  // SDK 가 이미 로드된 상태로 두어 스크립트 요청 없이 호출 흐름만 검증한다.
  window.AppleID = { auth: { init, signIn } };
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.AppleID;
  init.mockReset();
  signIn.mockReset();
});

describe('requestAppleWebCode', () => {
  it('Services ID 와 redirectURI 로 팝업 모드 초기화하고 authorizationCode 를 돌려준다', async () => {
    signIn.mockResolvedValue({ authorization: { code: 'apple_code', state: 'st_1' } });

    await expect(requestAppleWebCode('st_1')).resolves.toBe('apple_code');

    expect(init).toHaveBeenCalledWith({
      clientId: 'kr.example.web',
      scope: 'email',
      redirectURI: `${window.location.origin}/login/oauth2/code/apple`,
      state: 'st_1',
      usePopup: true,
    });
  });

  it.each(['popup_closed_by_user', 'user_cancelled_authorize'])(
    '%s 로 reject 되면 CANCELLED BridgeError 로 실패한다',
    async (errorName) => {
      signIn.mockRejectedValue({ error: errorName });

      await expect(requestAppleWebCode('st_1')).rejects.toMatchObject({
        name: 'BridgeError',
        code: 'CANCELLED',
      });
    },
  );

  it('취소가 아닌 오류는 일반 Error 로 실패한다', async () => {
    signIn.mockRejectedValue({ error: 'popup_blocked_by_browser' });

    await expect(requestAppleWebCode('st_1')).rejects.toThrow('popup_blocked_by_browser');
    await expect(requestAppleWebCode('st_1')).rejects.not.toMatchObject({ name: 'BridgeError' });
  });

  it('응답에 code 가 없으면 실패한다', async () => {
    signIn.mockResolvedValue({ authorization: {} });

    await expect(requestAppleWebCode('st_1')).rejects.toThrow('authorizationCode');
  });

  it('응답의 state 가 요청과 다르면 실패한다 (AC-6)', async () => {
    signIn.mockResolvedValue({ authorization: { code: 'apple_code', state: 'st_other' } });

    await expect(requestAppleWebCode('st_1')).rejects.toThrow('state');
  });

  it('VITE_APPLE_CLIENT_ID 가 없으면 SDK 를 건드리지 않고 실패한다', async () => {
    vi.stubEnv('VITE_APPLE_CLIENT_ID', '');

    await expect(requestAppleWebCode('st_1')).rejects.toThrow('VITE_APPLE_CLIENT_ID');
    expect(init).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
  });
});
