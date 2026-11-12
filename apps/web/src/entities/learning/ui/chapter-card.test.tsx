import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/shared/lib/testing';

import { ChapterCard } from './chapter-card';

function renderChapterCard(planetLoading?: 'eager' | 'lazy') {
  return renderWithProviders(
    () => (
      <ChapterCard
        chapterId={1}
        title="자료구조"
        progressPercent={40}
        planetLoading={planetLoading}
      />
    ),
    { extraPaths: ['/learning/chapters/$chapterId'] },
  );
}

describe('ChapterCard', () => {
  it('카드 전체가 챕터 상세 링크다 (FIX-073 #359 AC-1)', async () => {
    await renderChapterCard();

    expect(await screen.findByRole('link', { name: '자료구조 학습하기' })).toHaveAttribute(
      'href',
      '/learning/chapters/1',
    );
  });

  it('행성과 배경 장식은 alt="" 이미지이고, 덮개는 aria-hidden 이다', async () => {
    const { container } = await renderChapterCard();
    await screen.findByRole('link', { name: '자료구조 학습하기' });

    const images = Array.from(container.querySelectorAll('img'));
    // 배경 장식(<picture> 안) 1개 + 행성 1개
    expect(images).toHaveLength(2);
    expect(images.filter((img) => img.closest('picture'))).toHaveLength(1);
    images.forEach((img) => expect(img).toHaveAttribute('alt', ''));
  });

  it('planetLoading="eager" 인 첫 화면 카드만 장식에 fetchpriority="high" 를 단다', async () => {
    const { container, unmount } = await renderChapterCard('eager');
    await screen.findByRole('link', { name: '자료구조 학습하기' });
    expect(container.querySelector('picture img')).toHaveAttribute('fetchpriority', 'high');
    unmount();

    const lazy = await renderChapterCard('lazy');
    await screen.findByRole('link', { name: '자료구조 학습하기' });
    expect(lazy.container.querySelector('picture img')).toHaveAttribute('fetchpriority', 'auto');
  });
});
