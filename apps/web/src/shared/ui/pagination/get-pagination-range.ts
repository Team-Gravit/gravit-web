export type PaginationItem = number | 'ellipsis';

interface GetPaginationRangeParams {
  /** 현재 페이지 (1-based). 서버 응답의 `page`를 그대로 넘긴다. */
  currentPage: number;
  /** 전체 페이지 수. 서버 응답의 `totalPages`를 그대로 넘긴다. */
  totalPages: number;
  /** 현재 페이지 양옆에 함께 보일 페이지 수. */
  siblingCount?: number;
  /** 양 끝에 항상 보일 페이지 수. */
  boundaryCount?: number;
}

function range(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * 페이지 버튼 목록을 만든다. 전체를 다 못 보여줄 때 중간을 `ellipsis`로 접는다.
 * 서버는 `page`·`totalPages`만 주므로, "무엇을 어떻게 보여줄지"는 여기서 정한다.
 *
 * MUI usePagination과 같은 규칙: 양 끝(boundary)과 현재 페이지 주변(sibling)을 남기고
 * 그 사이를 접되, 접을 자리에 페이지가 하나뿐이면 생략 대신 그 번호를 그대로 둔다.
 */
export function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: GetPaginationRangeParams): PaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const siblingsStart = Math.max(
    Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
  );

  return [
    ...startPages,
    // 접을 자리에 페이지가 둘 이상이면 ellipsis, 딱 하나면 그 번호를 그대로 둔다.
    ...(siblingsStart > boundaryCount + 2
      ? (['ellipsis'] as const)
      : boundaryCount + 1 < totalPages - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? (['ellipsis'] as const)
      : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),
    ...endPages,
  ];
}
