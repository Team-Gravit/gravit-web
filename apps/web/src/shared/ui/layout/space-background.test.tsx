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

  it('기본 변형은 자식을 그대로 보여 주고 그라데이션 위에 alt="" 장식을 깐다', () => {
    const { container } = render(
      <SpaceBackground className="flex items-center justify-center">
        <p>자식</p>
      </SpaceBackground>,
    );

    expect(screen.getByText('자식')).toBeInTheDocument();
    const root = container.querySelector<HTMLElement>('[data-slot="space-background"]');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveClass('flex', 'items-center', 'justify-center');
    expect(root?.style.backgroundImage).toContain('linear-gradient');

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', '');
  });
});
