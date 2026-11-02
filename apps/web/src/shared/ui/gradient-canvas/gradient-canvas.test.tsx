import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { GradientCanvas } from './gradient-canvas';

const GRADIENT = 'linear-gradient(90deg, var(--color-space-start), var(--color-space-end))';
const DECORATION = {
  avifSrcSet: 'deco-1920.avif 1920w, deco-2560.avif 2560w',
  webpSrcSet: 'deco-1920.webp 1920w, deco-2560.webp 2560w',
  src: 'deco-1920.webp',
  sizes: '100vw',
};

describe('GradientCanvas', () => {
  it('자식을 보여 주고 상자 바탕에 그라데이션을 칠한다', () => {
    const { container } = render(
      <GradientCanvas gradient={GRADIENT} decoration={DECORATION} style={{ color: 'white' }}>
        <p>자식</p>
      </GradientCanvas>,
    );

    expect(screen.getByText('자식')).toBeInTheDocument();
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--canvas-gradient')).toBe(GRADIENT);
    expect(root.style.color).toBe('white');
  });

  it('장식은 alt="" 이미지 하나이고 avif · webp 후보를 함께 준다', () => {
    const { container } = render(<GradientCanvas gradient={GRADIENT} decoration={DECORATION} />);

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', '');
    expect(images[0]).toHaveAttribute('src', DECORATION.src);
    expect(container.querySelector('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      DECORATION.avifSrcSet,
    );
    expect(container.querySelector('source[type="image/webp"]')).toHaveAttribute('sizes', '100vw');
  });

  it('wide 를 주면 768px 이상 후보와 그라데이션을 따로 둔다', () => {
    const WIDE_GRADIENT = 'linear-gradient(0deg, var(--color-space-start), var(--color-space-end))';
    const { container } = render(
      <GradientCanvas
        gradient={GRADIENT}
        decoration={DECORATION}
        wide={{ gradient: WIDE_GRADIENT, decoration: { src: 'wide.webp' } }}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--canvas-gradient-wide')).toBe(WIDE_GRADIENT);
    expect(container.querySelector('source[media="(min-width: 768px)"]')).toHaveAttribute(
      'srcset',
      'wide.webp',
    );
    expect(container.querySelector('source[media="(min-width: 768px)"]')).not.toHaveAttribute(
      'type',
    );
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('wide 형식별 후보를 우선하고 그 다음에는 wide 기본 이미지를 쓴다', () => {
    const { container } = render(
      <GradientCanvas
        gradient={GRADIENT}
        decoration={DECORATION}
        wide={{
          gradient: GRADIENT,
          decoration: {
            avifSrcSet: 'wide.avif',
            webpSrcSet: 'wide.webp',
            src: 'wide.png',
          },
        }}
      />,
    );

    const sources = Array.from(container.querySelectorAll('source'));
    expect(sources.slice(0, 3).map((source) => source.getAttribute('type'))).toEqual([
      'image/avif',
      'image/webp',
      null,
    ]);
    expect(sources[2]).toHaveAttribute('srcset', 'wide.png');
    expect(sources[2]).toHaveAttribute('media', '(min-width: 768px)');
  });

  it('decorationPriority="high" 이면 장식에 fetchpriority="high" 를 단다', () => {
    const { container } = render(
      <GradientCanvas gradient={GRADIENT} decoration={DECORATION} decorationPriority="high" />,
    );

    expect(container.querySelector('img')).toHaveAttribute('fetchpriority', 'high');
  });

  it('넘긴 data 속성은 기본 data-slot 보다 우선한다', () => {
    const { container } = render(
      <GradientCanvas gradient={GRADIENT} decoration={DECORATION} data-slot="space-background" />,
    );

    expect(container.firstElementChild).toHaveAttribute('data-slot', 'space-background');
  });
});
