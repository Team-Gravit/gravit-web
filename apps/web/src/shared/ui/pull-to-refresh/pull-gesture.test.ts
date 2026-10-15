import { afterEach, describe, expect, it } from 'vitest';

import { applyRubberband, canScrollUpWithin, resolvePullDirection } from './pull-gesture';

describe('applyRubberband', () => {
  it('0 이하를 넘기면 0을 반환한다', () => {
    expect(applyRubberband(0, 260, 0.55)).toBe(0);
    expect(applyRubberband(-30, 260, 0.55)).toBe(0);
  });

  it('손가락 거리보다 짧은 거리를 반환한다', () => {
    expect(applyRubberband(100, 260, 0.55)).toBeLessThan(100);
  });

  it('많이 당길수록 늘어나는 폭이 줄어든다', () => {
    const firstHundred = applyRubberband(100, 260, 0.55);
    const nextHundred = applyRubberband(200, 260, 0.55) - firstHundred;

    expect(nextHundred).toBeLessThan(firstHundred);
  });

  it('아무리 당겨도 maxDistance 를 넘지 않는다', () => {
    expect(applyRubberband(100_000, 260, 0.55)).toBeLessThan(260);
  });
});

describe('canScrollUpWithin', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function createScrollTree() {
    document.body.innerHTML = `
      <div id="boundary" style="overflow-y: auto">
        <div id="inner" style="overflow-y: auto">
          <button id="target">항목</button>
        </div>
      </div>
    `;
    return {
      boundary: document.getElementById('boundary')!,
      inner: document.getElementById('inner')!,
      target: document.getElementById('target')!,
    };
  }

  it('모든 영역이 맨 위면 false 를 반환한다', () => {
    const { boundary, target } = createScrollTree();

    expect(canScrollUpWithin(target, boundary)).toBe(false);
  });

  it('boundary 가 내려가 있으면 true 를 반환한다', () => {
    const { boundary, target } = createScrollTree();
    boundary.scrollTop = 40;

    expect(canScrollUpWithin(target, boundary)).toBe(true);
  });

  it('안쪽 스크롤 영역이 내려가 있으면 true 를 반환한다', () => {
    const { boundary, inner, target } = createScrollTree();
    inner.scrollTop = 40;

    expect(canScrollUpWithin(target, boundary)).toBe(true);
  });

  it('overflow 가 hidden 인 영역은 내려가 있어도 무시한다', () => {
    const { boundary, inner, target } = createScrollTree();
    inner.style.overflowY = 'hidden';
    inner.scrollTop = 40;

    expect(canScrollUpWithin(target, boundary)).toBe(false);
  });

  it('boundary 바깥 조상은 확인하지 않는다', () => {
    const { boundary, target } = createScrollTree();
    document.body.style.overflowY = 'auto';
    document.body.scrollTop = 40;

    expect(canScrollUpWithin(target, boundary)).toBe(false);
    document.body.removeAttribute('style');
  });
});

describe('resolvePullDirection', () => {
  it('lockDistance 보다 적게 움직이면 undecided 를 반환한다', () => {
    expect(resolvePullDirection(3, 4, 6)).toBe('undecided');
  });

  it('아래로 더 많이 움직이면 pull 을 반환한다', () => {
    expect(resolvePullDirection(2, 10, 6)).toBe('pull');
  });

  it('가로로 더 많이 움직이면 ignore 를 반환한다', () => {
    expect(resolvePullDirection(12, 8, 6)).toBe('ignore');
  });

  it('위로 움직이면 ignore 를 반환한다', () => {
    expect(resolvePullDirection(0, -10, 6)).toBe('ignore');
  });
});
