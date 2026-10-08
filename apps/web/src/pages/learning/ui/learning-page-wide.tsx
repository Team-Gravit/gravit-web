import { ChapterGrid } from '@/widgets/chapter-grid';
import { HeroGreeting } from '@/widgets/hero-greeting';

export function LearningPageWide() {
  return (
    <div data-slot="learning-page" data-layout="wide" className="flex min-h-full flex-col bg-bg-2">
      <HeroGreeting />
      {/*
        시안에서 이 자리를 차지하던 「개념학습·면접대비」 탭 행의 높이(68px)를 여백으로 남긴다.
        탭은 동작하지 않아 제거했지만 히어로와 그리드의 간격은 시안과 같아야 한다.
      */}
      <div aria-hidden className="h-17" />
      {/* 시안의 1200px 본문 폭. 좌우 18px은 카드 그리드의 안쪽 여백이다. */}
      <main className="mx-auto w-full max-w-300 flex-1 px-4.5 pb-20">
        <ChapterGrid size="lg" />
      </main>
    </div>
  );
}
