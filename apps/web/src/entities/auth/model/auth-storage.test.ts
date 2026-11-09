import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearSessionHint,
  clearStoredTokens,
  hasSessionHint,
  hasStoredTokens,
  readStoredAccessToken,
  readStoredRefreshToken,
  writeStoredAccessToken,
  writeSessionHint,
  writeStoredTokens,
} from './auth-storage';

beforeEach(() => {
  localStorage.clear();
});

describe('writeStoredTokens', () => {
  it("키 이름 'accessToken' · 'refreshToken' 으로 저장한다", () => {
    writeStoredTokens({ accessToken: 'tok_abc', refreshToken: 'ref_1' });

    expect(localStorage.getItem('accessToken')).toBe('tok_abc');
    expect(localStorage.getItem('refreshToken')).toBe('ref_1');
  });
});

describe('writeStoredAccessToken', () => {
  it('accessToken 만 교체하고 refreshToken 은 그대로 둔다', () => {
    writeStoredTokens({ accessToken: 'tok_old', refreshToken: 'ref_1' });

    writeStoredAccessToken('tok_new');

    expect(readStoredAccessToken()).toBe('tok_new');
    expect(readStoredRefreshToken()).toBe('ref_1');
  });
});

describe('clearStoredTokens', () => {
  it('두 키를 모두 제거한다', () => {
    writeStoredTokens({ accessToken: 'tok_abc', refreshToken: 'ref_1' });

    clearStoredTokens();

    expect(readStoredAccessToken()).toBeNull();
    expect(readStoredRefreshToken()).toBeNull();
  });
});

describe('세션 힌트', () => {
  it("키 이름 'hasSession' 으로 쓰고 지운다", () => {
    writeSessionHint();
    expect(localStorage.getItem('hasSession')).not.toBeNull();
    expect(hasSessionHint()).toBe(true);

    clearSessionHint();
    expect(hasSessionHint()).toBe(false);
  });

  it('힌트는 토큰으로 취급하지 않는다', () => {
    writeSessionHint();

    expect(hasStoredTokens()).toBe(false);
  });
});
