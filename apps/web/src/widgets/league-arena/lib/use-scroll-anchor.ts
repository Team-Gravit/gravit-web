import { useEffect, useLayoutEffect, useRef } from 'react';

// 첫 진입 smooth 스크롤이 끝났다고 보고 옵저버를 켜기까지 기다리는 시간(ms).
// 네이티브 smooth 스크롤은 끝나는 시점을 알려주지 않아 대략의 시간만큼 기다린다.
const CENTER_SCROLL_SETTLE_MS = 600;

interface UseScrollAnchorParams {
  /** 내 순위를 중앙에 띄우는 모드(내 티어일 때만 true). false면 하단 단방향 무한스크롤만 한다. */
  centerMode: boolean;
  /** 현재 목록의 행 수. 페이지 로드 변화를 감지하는 안정 신호. */
  rowCount: number;
  /** 목록 첫 행의 식별자. 상단 prepend를 감지해 스크롤 위치를 보정하는 기준. */
  firstRowId: number | null;
  /** 센터링 대상(내 행)이 현재 렌더돼 있는가. */
  hasTarget: boolean;
  /** 센터링을 애니메이션으로 보여줄지(첫 진입) 즉시 점프할지(티어 전환 재진입). */
  animateCentering: boolean;

  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
  onLoadPrevious: () => void;

  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

/**
 * 리그 랭킹 리스트의 스크롤을 담당한다.
 *
 * - 센터 모드: 진입 시 위·아래 한 페이지씩 버퍼를 채운 뒤 내 행을 중앙으로 스크롤한다
 *   (첫 진입은 부드럽게, 티어 전환 재진입은 즉시). 센터링이 끝나면 상·하단 센티넬로 양방향 로딩을 켠다.
 * - 센터링 중에 옵저버를 켜면 상단 prepend가 일어나 그 보정이 스크롤을 밀어 애니메이션을 끊으므로,
 *   스크롤이 멈춘 뒤에 옵저버를 켠다.
 * - 상단 prepend는 보이는 위치가 아래로 튀므로, 늘어난 높이만큼 scrollTop을 더해 보정한다
 *   (paint 전에 해야 깜빡이지 않아 useLayoutEffect).
 * - 비(非)센터 모드: 하단 센티넬만으로 아래로만 더 불러온다.
 *
 * 반환한 ref를 스크롤 컨테이너·상/하단 센티넬·내 행에 각각 붙인다.
 */
export function useScrollAnchor({
  centerMode,
  rowCount,
  firstRowId,
  hasTarget,
  animateCentering,
  hasPreviousPage,
  isFetchingPreviousPage,
  onLoadPrevious,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UseScrollAnchorParams) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // 옵저버(양방향 로딩)를 켜도 되는 시점. 센터링 스크롤이 끝난 뒤 true가 된다.
  const hasCenteredRef = useRef(false);
  // 센터링을 한 번만 시작하기 위한 가드.
  const centeringStartedRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);

  // 진입 버퍼링을 방향별로 한 번씩만 요청하기 위한 체크.
  const prevBufferedRef = useRef(false);
  const nextBufferedRef = useRef(false);

  // prepend 보정용: 직전 렌더의 첫 행 식별자와 컨테이너 높이.
  const prevFirstRowIdRef = useRef<number | null>(null);
  const prevScrollHeightRef = useRef(0);

  // --- 진입 센터링: (첫 진입만) 위/아래 버퍼 확보 후 내 행을 중앙으로 ---
  useLayoutEffect(() => {
    if (!centerMode || centeringStartedRef.current) return;
    const container = scrollRef.current;
    const target = targetRef.current;
    if (!container || !target || !hasTarget) return;

    // 버퍼링은 첫 진입(animate)에서만. 재진입은 이미 캐시된 이웃 위에서 바로 센터한다 — 재진입마다
    // fetch를 돌리면 빠른 티어 전환 중 비동기 로딩이 센터 타이밍과 엇갈려 위치가 어긋난다.
    if (animateCentering) {
      if (hasPreviousPage && !prevBufferedRef.current && !isFetchingPreviousPage) {
        prevBufferedRef.current = true;
        onLoadPrevious();
        return;
      }
      if (hasNextPage && !nextBufferedRef.current && !isFetchingNextPage) {
        nextBufferedRef.current = true;
        onLoadMore();
        return;
      }
      if (isFetchingPreviousPage || isFetchingNextPage) return;
    }

    // 버퍼가 준비됐거나 더 받을 페이지가 없음 → 중앙 정렬. 이후 prepend 보정의 기준점도 지금 값으로.
    centeringStartedRef.current = true;
    prevScrollHeightRef.current = container.scrollHeight;
    prevFirstRowIdRef.current = firstRowId;
    target.scrollIntoView({ behavior: animateCentering ? 'smooth' : 'auto', block: 'center' });

    // 즉시 점프(재진입)는 바로 옵저버를 켜도 안전하고, smooth(첫 진입)는 스크롤이 끝날 때쯤 켠다.
    if (animateCentering) {
      settleTimerRef.current = window.setTimeout(() => {
        hasCenteredRef.current = true;
      }, CENTER_SCROLL_SETTLE_MS);
    } else {
      hasCenteredRef.current = true;
    }
  }, [
    centerMode,
    hasTarget,
    animateCentering,
    firstRowId,
    hasPreviousPage,
    isFetchingPreviousPage,
    onLoadPrevious,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  ]);

  // 언마운트 시 대기 중인 타이머 정리.
  useEffect(() => {
    return () => {
      if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
    };
  }, []);

  // --- 상단 prepend 스크롤 보정 (센터링 이후에만) ---
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isPrepend =
      prevFirstRowIdRef.current !== null && firstRowId !== prevFirstRowIdRef.current;

    if (hasCenteredRef.current && isPrepend) {
      // 위에 끼워진 행 높이만큼 scrollTop 을 밀어 보이는 위치를 고정한다.
      container.scrollTop += container.scrollHeight - prevScrollHeightRef.current;
    }

    prevFirstRowIdRef.current = firstRowId;
    prevScrollHeightRef.current = container.scrollHeight;
  }, [firstRowId, rowCount]);

  // --- 하단 센티넬: 아래로 더 불러오기 ---
  useEffect(() => {
    const root = scrollRef.current;
    const target = bottomSentinelRef.current;
    if (!root || !target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 센터 모드 진입 중(센터링 전)에는 버퍼링을 명시 호출이 맡으므로 콜백을 막는다.
        if (centerMode && !hasCenteredRef.current) return;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { root, threshold: 1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [centerMode, hasNextPage, isFetchingNextPage, onLoadMore, rowCount]);

  // --- 상단 센티넬: 위로 더 불러오기 (센터 모드 전용, 센터링 이후에만 콜백 동작) ---
  useEffect(() => {
    const root = scrollRef.current;
    const target = topSentinelRef.current;
    if (!centerMode || !root || !target || !hasPreviousPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasCenteredRef.current) return;
        if (entry.isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
          onLoadPrevious();
        }
      },
      { root, threshold: 1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [centerMode, hasPreviousPage, isFetchingPreviousPage, onLoadPrevious, rowCount]);

  return { scrollRef, topSentinelRef, bottomSentinelRef, targetRef };
}
