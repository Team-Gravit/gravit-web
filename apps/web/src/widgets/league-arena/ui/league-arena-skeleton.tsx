import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';

import { SKELETON_FILL, SKELETON_FILL_STRONG } from '../model/constants';
import { RankingRowSkeleton } from './ranking-row-skeleton';

// 좁은 화면에 보이는 배지 수.
const TIER_BADGE_COUNT = 5;
const CENTER_BADGE_INDEX = Math.floor(TIER_BADGE_COUNT / 2);
// RankingList의 스켈레톤 행 수와 같게 둬 fallback → 실제 전환 시 랭킹 영역이 안 튀게 한다.
const RANKING_ROW_COUNT = 8;

/**
 * 리그 아레나 로딩 스켈레톤(시즌·캐러셀·랭킹). home·profile 로딩 동안 전체 화면 fallback으로 쓴다.
 *
 * LeagueArena와 같은 2단 레이아웃·여백을 그대로 복제해 실제 콘텐츠로 바뀔 때 레이아웃이 밀리지
 * 않게(CLS) 한다. 랭킹 자리는 RankingList와 같은 RankingRowSkeleton을 써, 로딩 단계가 넘어가도
 * 같은 스켈레톤이 끊김 없이 이어진다.
 */
export function LeagueArenaSkeleton() {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <div className="flex h-full w-full flex-col md:flex-row md:justify-center md:gap-[72px]">
        {/* 좌: 시즌 + 캐러셀 (LeagueArena의 좌측 section과 동일 구조) */}
        <section className="flex shrink-0 flex-col items-center pt-10 pb-6 md:w-auto md:max-w-[731px] md:py-0">
          <div className="flex w-full flex-col items-center gap-6 md:w-auto md:gap-10">
            {/* 시즌: 제목 + 타이머 pill */}
            <div className="flex flex-col items-center gap-2 md:gap-8">
              <Skeleton
                variant="block"
                animation="pulse"
                className={cn('h-8.25 w-22 rounded-6 md:h-24 md:w-67.5', SKELETON_FILL)}
              />
              <Skeleton
                variant="block"
                animation="pulse"
                className={cn('h-8 w-44 rounded-full md:h-19.5 md:w-131', SKELETON_FILL)}
              />
            </div>

            {/* 캐러셀: 가운데 큰 배지 + 양옆 + 중앙 라벨 */}
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full items-end justify-center gap-4 overflow-hidden md:w-[664px] md:items-center md:gap-8 md:py-10">
                {Array.from({ length: TIER_BADGE_COUNT }).map((_, index) => {
                  const distance = Math.abs(index - CENTER_BADGE_INDEX);
                  const isCenter = distance === 0;

                  return (
                    // 바깥 상자는 TierSelector의 버튼과 같은 크기라 배지 간격이 맞는다.
                    <div
                      key={index}
                      className={cn(
                        'flex h-27.5 w-16 shrink-0 items-end justify-center md:h-70 md:w-55 md:items-center',
                        // 넓은 화면에는 가운데와 양옆 하나씩만 보인다.
                        distance > 1 && 'md:hidden',
                      )}
                    >
                      <Skeleton
                        variant="block"
                        animation="pulse"
                        className={cn(
                          'shrink-0 rounded-12',
                          isCenter ? 'h-27 w-21.5 md:h-67.5 md:w-54' : 'h-20 w-16 md:h-50 md:w-40',
                          isCenter ? SKELETON_FILL_STRONG : SKELETON_FILL,
                        )}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-col items-center md:mt-10">
                <Skeleton
                  variant="block"
                  animation="pulse"
                  className={cn('h-6.25 w-14 rounded-6 md:h-12.5 md:w-25', SKELETON_FILL)}
                />
                {/* LP는 데스크톱만 */}
                <Skeleton
                  variant="block"
                  animation="pulse"
                  className={cn('mt-2 hidden h-7 w-32 rounded-6 md:block', SKELETON_FILL)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 우: 랭킹 (LeagueArena의 우측 section + RankingList 스켈레톤 컨테이너와 동일) */}
        <section className="flex min-h-0 flex-1 flex-col border-t border-bg-4 md:w-[664px] md:min-w-[400px] md:border-0 md:pt-0">
          <div className="flex px-4 w-full flex-col gap-3 overflow-hidden pt-6 md:gap-6 md:px-5.5 md:py-1">
            {Array.from({ length: RANKING_ROW_COUNT }).map((_, index) => (
              <RankingRowSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
