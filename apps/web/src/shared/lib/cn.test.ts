import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('같은 그룹의 클래스가 겹치면 뒤에 온 것이 이긴다', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('falsy 값은 무시한다', () => {
    expect(cn('p-2', false, undefined, null, '')).toBe('p-2');
  });

  // 아래 두 개가 cn.ts 의 커스텀 확장이 실제로 동작하는지 지키는 테스트다.
  // 확장이 빠지면 조용히(에러 없이) 클래스가 사라져 스타일만 어긋난다.
  describe('커스텀 타이포 토큰', () => {
    it('타이포 토큰과 색상 토큰은 서로 다른 그룹이라 둘 다 남는다', () => {
      const result = cn('text-body1-normal', 'text-text-1');

      expect(result).toContain('text-body1-normal');
      expect(result).toContain('text-text-1');
    });

    it('타이포 토큰끼리 겹치면 뒤에 온 것이 이긴다', () => {
      expect(cn('text-body1-normal', 'text-display1')).toBe('text-display1');
    });
  });

  describe('커스텀 radius 토큰', () => {
    it('숫자 radius 끼리 겹치면 뒤에 온 것이 이긴다', () => {
      expect(cn('rounded-8', 'rounded-12')).toBe('rounded-12');
    });

    it('방향별 radius 는 전체 radius 와 별개로 유지된다', () => {
      const result = cn('rounded-8', 'rounded-t-12');

      expect(result).toContain('rounded-8');
      expect(result).toContain('rounded-t-12');
    });
  });
});
