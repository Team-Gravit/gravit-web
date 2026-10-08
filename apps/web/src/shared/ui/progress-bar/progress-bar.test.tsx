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

  // 화면별 채움 스타일은 공개 variant 계약이므로 클래스 조합까지 검증한다.
  it('fill 을 넘기지 않으면 그라데이션으로 채운다', () => {
    render(<ProgressBar value={31} aria-label="경험치" />);

    const fill = screen.getByRole('progressbar', { name: '경험치' }).firstElementChild;
    expect(fill).toHaveClass('bg-brand-gradient');
  });

  it('fill="solid" 면 그라데이션 대신 단색으로 채운다', () => {
    render(<ProgressBar value={31} fill="solid" aria-label="경험치" />);

    const fill = screen.getByRole('progressbar', { name: '경험치' }).firstElementChild;
    expect(fill).toHaveClass('bg-main');
    expect(fill).not.toHaveClass('bg-brand-gradient');
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
