import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

import { ResultBackground } from './result-background';

function renderBackground(isVisible = false) {
  const onReady = vi.fn();
  const { container } = render(<ResultBackground isVisible={isVisible} onReady={onReady} />);
  const image = container.querySelector('[data-slot="background-decoration"] img');

  if (!image) {
    throw new Error('배경 장식 이미지를 찾지 못했다');
  }

  return { onReady, image, container };
}

describe('ResultBackground', () => {
  it('이미지를 받아오지 못해도 준비 완료를 알린다', () => {
    const { onReady, image } = renderBackground();

    fireEvent.error(image);

    expect(onReady).toHaveBeenCalled();
  });

  it('준비되기 전에는 장식을 감춰 둔다', () => {
    const { container } = renderBackground(false);

    expect(container.querySelector('[data-slot="background-decoration"]')).not.toHaveAttribute(
      'data-visible',
    );
  });

  it('보여도 된다고 알려주면 장식을 드러낸다', () => {
    const { container } = renderBackground(true);

    expect(container.querySelector('[data-slot="background-decoration"]')).toHaveAttribute(
      'data-visible',
    );
  });
});
