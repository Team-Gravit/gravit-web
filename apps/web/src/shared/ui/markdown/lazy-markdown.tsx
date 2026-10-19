import { lazy, Suspense, type ReactNode } from 'react';

import type { MarkdownProps as MarkdownContentProps } from './markdown';

type MarkdownModule = typeof import('./markdown');

// 라우트에서 미리 받은 모듈을 첫 렌더에도 사용해 Suspense로 인한 추가 렌더를 피한다.
let loadedMarkdownModule: MarkdownModule | undefined;

const loadMarkdown = () =>
  import('./markdown').then((module) => {
    loadedMarkdownModule = module;
    return module;
  });

const LazyMarkdown = lazy(() => loadMarkdown().then((module) => ({ default: module.Markdown })));

/** 라우트 진입 시 마크다운 청크를 받기 시작한다. 다운로드 완료를 기다리지는 않는다. */
export function preloadMarkdown() {
  void loadMarkdown();
}

export interface MarkdownProps extends MarkdownContentProps {
  fallback?: ReactNode;
}

export function Markdown({ fallback = null, ...props }: MarkdownProps) {
  if (loadedMarkdownModule) {
    const { Markdown: LoadedMarkdown } = loadedMarkdownModule;
    return <LoadedMarkdown {...props} />;
  }

  return (
    <Suspense fallback={fallback}>
      <LazyMarkdown {...props} />
    </Suspense>
  );
}
