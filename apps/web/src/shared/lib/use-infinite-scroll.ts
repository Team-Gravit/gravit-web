import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  enabled?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  /** 스크롤 컨테이너. 지정하면 그 안에서의 교차를 관찰한다(모달 내부 목록 등). */
  root?: Element | null;
  rootMargin?: string;
}

/**
 * 감시 대상(sentinel)이 뷰포트/root에 들어오면 다음 페이지를 불러온다.
 * 반환한 ref를 목록 끝 sentinel 요소에 붙인다.
 */
export function useInfiniteScroll({
  enabled = true,
  hasNextPage = false,
  isFetchingNextPage,
  fetchNextPage,
  root = null,
  rootMargin = '80px',
}: UseInfiniteScrollOptions) {
  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const sentinel = ref.current;
    if (!enabled || !hasNextPage || isFetchingNextPage || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { root, rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, root, rootMargin]);

  return ref;
}
