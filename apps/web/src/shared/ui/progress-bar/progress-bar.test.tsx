import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LabeledProgressBar } from './labeled-progress-bar';
import { ProgressBar, clampPercent } from './progress-bar';

describe('clampPercent', () => {
  it('0~100 밖의 값과 NaN 을 범위 안으로 자른다', () => {
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(150)).toBe(100);
    expect(clampPercent(Number.NaN)).toBe(0);
    expect(clampPercent(42)).toBe(42);
  });
});

describe('ProgressBar', () => {
  it('value 를 aria-valuenow 로 노출한다', () => {
    render(<ProgressBar value={31} aria-label="경험치" />);

    expect(screen.getByRole('progressbar', { name: '경험치' })).toHaveAttribute(
      'aria-valuenow',
      '31',
    );
  });
});

describe('LabeledProgressBar', () => {
  it('라벨이 게이지의 이름이 되고 퍼센트 표기와 값이 같다', () => {
    render(<LabeledProgressBar label="자료구조" value={10} />);

    expect(screen.getByRole('progressbar', { name: '자료구조' })).toHaveAttribute(
      'aria-valuenow',
      '10',
    );
    expect(screen.getByText('10%')).toBeInTheDocument();
  });
});
