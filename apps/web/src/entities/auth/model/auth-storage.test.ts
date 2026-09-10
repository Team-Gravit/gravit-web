import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearStoredTokens,
  readStoredAccessToken,
  readStoredRefreshToken,
  writeStoredAccessToken,
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
