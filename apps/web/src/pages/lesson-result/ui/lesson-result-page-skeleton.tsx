import { Skeleton } from '@/shared/ui/skeleton';

export function LessonResultPageSkeleton() {
  return (
    <main
      data-slot="lesson-result-page-skeleton"
      role="status"
      aria-label="결과를 불러오는 중"
      aria-busy="true"
      className="z-10 mx-auto flex w-full max-w-[39.375rem] flex-1 flex-col px-4 py-5 md:justify-center md:px-0 md:py-10"
    >
      <div className="md:glass-morphism-border relative flex flex-1 flex-col gap-4 rounded-12 md:flex-none md:gap-10 md:bg-linear-[107deg,rgba(255,255,255,0.24),rgba(255,255,255,0.06)] md:p-8 md:shadow-[0_4px_32px_0_rgba(0,0,0,0.02)] md:backdrop-blur-md md:after:rounded-12">
        <div className="flex flex-1 flex-col gap-6 md:flex-none md:gap-8 md:pt-6">
          <div className="flex flex-1 flex-col justify-end md:flex-none">
            <div className="flex flex-col items-center gap-10 md:gap-8">
              <div className="flex w-full flex-col items-center gap-1 md:gap-2">
                <Skeleton className="w-4/5 max-w-80 bg-white/20 text-heading1 md:text-title2" />
                <Skeleton className="w-2/5 max-w-40 bg-white/20 text-label2 md:text-headline1" />
              </div>
              <Skeleton
                variant="block"
                className="h-[17.625rem] w-[17.6875rem] rounded-full bg-white/20 md:h-[14.6875rem] md:w-[19.1875rem]"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 md:gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-end justify-between">
                <Skeleton className="w-16 bg-white/20 text-label1 md:text-body1-normal" />
                <Skeleton className="w-20 bg-white/20 text-label1 md:text-body1-normal" />
              </div>
              <Skeleton
                variant="block"
                className="h-2 w-full rounded-full bg-white/20 md:h-[13px]"
              />
            </div>
            <Skeleton
              variant="block"
              className="h-[82px] w-full rounded-8 bg-white/20 md:h-[92px]"
            />
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          <Skeleton variant="block" className="h-[54px] flex-1 basis-0 rounded-8 bg-white/20" />
          <Skeleton variant="block" className="h-[54px] flex-1 basis-0 rounded-8 bg-white/20" />
        </div>
      </div>
    </main>
  );
}
