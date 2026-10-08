import { describe, expect, it } from 'vitest';

import { DESKTOP_CHART_CONFIG as CONFIG } from './config';
import { getChartGeometry } from './get-chart-geometry';

describe('getChartGeometry', () => {
  it('첫 포인트는 왼쪽 padding, 마지막은 오른쪽 경계에 놓인다', () => {
    const { positioned } = getChartGeometry({
      points: [
        { key: 'a', x: 0, y: 1 },
        { key: 'b', x: 1, y: 2 },
      ],
      config: CONFIG,
      yMin: 1,
      yMax: 2,
    });

    expect(positioned[0].px).toBe(CONFIG.padding.left);
    expect(positioned[1].px).toBe(CONFIG.width - CONFIG.padding.right);
  });

  it('큰 y 값이 화면 위(작은 좌표)에 온다', () => {
    const { getY } = getChartGeometry({
      points: [{ key: 'a', x: 0, y: 1 }],
      config: CONFIG,
      yMin: 1,
      yMax: 3,
    });

    expect(getY(3)).toBeLessThan(getY(1));
  });

  it('yMin과 yMax가 같으면 바닥선에 둔다', () => {
    const { getY } = getChartGeometry({
      points: [{ key: 'a', x: 0, y: 1 }],
      config: CONFIG,
      yMin: 1,
      yMax: 1,
    });

    expect(getY(1)).toBe(CONFIG.height - CONFIG.padding.bottom);
  });

  it('빈 배열이면 areaPath는 빈 문자열이다', () => {
    const { areaPath } = getChartGeometry({ points: [], config: CONFIG, yMin: 0, yMax: 1 });

    expect(areaPath).toBe('');
  });
});
