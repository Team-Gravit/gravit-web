import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

import { ResultHero } from './result-hero';

function stubViewport(isWideViewport: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      matches: isWideViewport,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ResultHero', () => {
  it('넓은 화면에서는 모바일 달 이미지를 렌더링하지 않는다', () => {
    stubViewport(true);

    const { container } = render(
      <ResultHero
        chapterId={1}
        unitTitle="배열"
        isIllustrationVisible={false}
        onIllustrationReady={vi.fn()}
      />,
    );

    expect(container.querySelector('[data-slot="mobile-moon"]')).not.toBeInTheDocument();
  });

  it('좁은 화면에서는 모바일 달 이미지를 렌더링한다', () => {
    stubViewport(false);

    const { container } = render(
      <ResultHero
        chapterId={1}
        unitTitle="배열"
        isIllustrationVisible={false}
        onIllustrationReady={vi.fn()}
      />,
    );

    expect(container.querySelector('[data-slot="mobile-moon"]')).toBeInTheDocument();
  });

  it('페이드인 전에 디코딩할 이미지는 지연 로딩하지 않는다', () => {
    stubViewport(false);

    const { container } = render(
      <ResultHero
        chapterId={1}
        unitTitle="배열"
        isIllustrationVisible={false}
        onIllustrationReady={vi.fn()}
      />,
    );

    const images = Array.from(container.querySelectorAll('img'));
    expect(images).toHaveLength(3);
    expect(images.filter((image) => image.getAttribute('loading') === 'lazy')).toHaveLength(0);
  });
});
