import { describe, expect, it } from 'vitest';

import { isValidNickname, normalizeNickname } from './nickname';

describe('isValidNickname', () => {
  it.each(['그래빗', 'ab', 'Gravit12', '12345678', '가나다라마바사아'])(
    '%s 는 사용할 수 있다',
    (nickname) => {
      expect(isValidNickname(nickname)).toBe(true);
    },
  );

  it('1자는 짧아서 쓸 수 없다', () => {
    expect(isValidNickname('ㄱ')).toBe(false);
  });

  it('9자는 길어서 쓸 수 없다', () => {
    expect(isValidNickname('123456789')).toBe(false);
  });

  it('빈 값은 쓸 수 없다', () => {
    expect(isValidNickname('')).toBe(false);
  });

  it.each(['!!!', '그래빗!', 'gra vit', ' 그래빗 ', '그래빗_1'])(
    '%s 는 특수문자·공백이 섞여 쓸 수 없다',
    (nickname) => {
      expect(isValidNickname(nickname)).toBe(false);
    },
  );
});

describe('normalizeNickname', () => {
  it('앞뒤 공백을 제거한다', () => {
    expect(normalizeNickname('  그래빗  ')).toBe('그래빗');
  });

  it('가운데 공백은 건드리지 않는다', () => {
    expect(normalizeNickname(' gra vit ')).toBe('gra vit');
  });
});
