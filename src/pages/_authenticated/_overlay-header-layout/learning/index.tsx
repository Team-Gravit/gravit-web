import { createFileRoute } from '@tanstack/react-router';

import ChapterCard from '@/entities/chapter/chapter-card';
import { useFetchChapters } from '@/entities/learning/model/hooks';
import HeroSection from '@/shared/ui/hero/hero-section';
import MainGreeting from '@/widgets/main-page/main-greeting';
import MainSectionError from '@/widgets/main-page/ui/main-section-error';

const CHAPTER_SKELETON_COUNT = 6;

export const Route = createFileRoute('/_authenticated/_overlay-header-layout/learning/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { chapters, isPending, isError, refetch } = useFetchChapters();

  return (
    <>
      <header className="md:hidden w-full flex items-center justify-center h-12 border-b border-divider-1 fixed bg-white z-5">
        <h1 className="text-label1 text-text-2">학습</h1>
      </header>
      <main className="flex-1 flex flex-col justify-start w-full items-center bg-bg-1 py-5 gap-4 md:gap-0 pt-12 md:pt-0 md:pb-20">
        <div className="w-full h-fit hidden md:block">
          <HeroSection>
            <HeroSection.Content className="text-white">
              <MainGreeting variant="desktop" />
            </HeroSection.Content>
          </HeroSection>
        </div>
        <ul className="w-full px-4 md:px-0 flex h-10 md:h-17 text-label1 md:bg-white md:mb-8">
          <li className="flex-1 h-full flex items-center justify-center text-main border-b-2 border-text-main md:text-heading1">
            개념학습
          </li>
          <li className="flex-1 h-full flex items-center justify-center text-text-4 border-b-[0.5px] border-text-4 md:text-heading1">
            면접대비
          </li>
        </ul>
        <ul className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 max-w-[1200px]">
          {isPending &&
            Array.from({ length: CHAPTER_SKELETON_COUNT }).map((_, index) => (
              <li key={index}>
                <ChapterCard isLoading />
              </li>
            ))}

          {isError && (
            <li className="col-span-full">
              <MainSectionError label="챕터 목록" onRetry={() => void refetch()} />
            </li>
          )}

          {!isPending && !isError && chapters?.length === 0 && (
            <li className="col-span-full">챕터가 없습니다.</li>
          )}

          {chapters?.map((chapter) => (
            <li key={chapter.chapterId}>
              <ChapterCard chapter={chapter} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
