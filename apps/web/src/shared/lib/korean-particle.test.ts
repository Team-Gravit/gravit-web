import { describe, expect, it } from 'vitest';

import { withObjectParticle } from './korean-particle';

describe('withObjectParticle', () => {
  it('받침이 있으면 「을」, 없으면 「를」을 붙인다', () => {
    expect(withObjectParticle('오늘의 미션')).toBe('오늘의 미션을');
    expect(withObjectParticle('이어서 학습하기')).toBe('이어서 학습하기를');
    expect(withObjectParticle('성장 현황')).toBe('성장 현황을');
  });

  it('한글이 아닌 글자로 끝나면 「를」을 붙인다', () => {
    expect(withObjectParticle('XP')).toBe('XP를');
    expect(withObjectParticle('')).toBe('를');
  });
});
