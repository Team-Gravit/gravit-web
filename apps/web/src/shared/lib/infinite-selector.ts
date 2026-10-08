import type { InfiniteData } from '@tanstack/react-query';

/** page 기반 무한 쿼리의 모든 페이지 contents를 한 배열로 평탄화한다. */
export function infiniteSelector<T>(
  data: InfiniteData<{ contents: T[] }> | undefined,
): T[] {
  return data?.pages.flatMap((page) => page.contents) ?? [];
}
