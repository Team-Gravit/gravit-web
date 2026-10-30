import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { SpaceBackground } from './space-background';

describe('SpaceBackground', () => {
  it('starfield 이면 자식을 그대로 보여 주고 배경을 alt="" 이미지로 깐다', () => {
    const { container } = render(
      <SpaceBackground variant="starfield" className="bg-bg-1">
        <p>자식</p>
      </SpaceBackground>,
    );

    expect(screen.getByText('자식')).toBeInTheDocument();
    const root = container.querySelector('[data-slot="space-background"]');
    expect(root).toHaveAttribute('data-variant', 'starfield');
    expect(root).toHaveClass('bg-bg-1');

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', '');
    expect(container.querySelector('source[type="image/avif"]')).toBeInTheDocument();
  });

  it('기본 변형은 이미지 요소 없이 CSS 배경을 쓴다', () => {
    const { container } = render(
      <SpaceBackground>
        <p>자식</p>
      </SpaceBackground>,
    );

    const root = container.querySelector('[data-slot="space-background"]');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root?.getAttribute('style')).toContain('background-image');
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
