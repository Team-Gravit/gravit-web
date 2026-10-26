import {
  NoticeListItem,
  NoticeListItemSkeleton,
  type NoticeSummaryResponse,
} from '@/entities/notice';

/** 한 페이지에 표시되는 공지 수에 맞춘 스켈레톤 행 수(시안 기준 8행). */
const SKELETON_ROW_COUNT = 8;
const EMPTY_MESSAGE = '등록된 공지사항이 없어요';

interface NoticeListProps {
  notices: NoticeSummaryResponse[];
  /** 실제 조회 중인지. 지연 전(<300ms)에는 빈 상태 대신 아무것도 그리지 않는다. */
  isPending: boolean;
  /** 조회가 300ms 이상 지연됐는지. 이때만 스켈레톤을 띄운다. */
  showSkeleton: boolean;
}

/** 공지 목록 카드. 로딩(지연 시 스켈레톤)·빈 상태·목록을 그린다. */
export function NoticeList({ notices, isPending, showSkeleton }: NoticeListProps) {
  if (showSkeleton) {
    return (
      <ul className="overflow-hidden rounded-8 md:rounded-12">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <NoticeListItemSkeleton key={index} />
        ))}
      </ul>
    );
  }

  // 지연 임계값 전의 로딩 구간: 빈 상태가 깜빡이지 않도록 아무것도 그리지 않는다.
  if (isPending) {
    return null;
  }

  if (notices.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-8 bg-white md:rounded-12">
        <p className="text-headline1 text-text-2 md:text-heading1">{EMPTY_MESSAGE}</p>
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-8 md:rounded-12">
      {notices.map((notice) => (
        <NoticeListItem key={notice.id} notice={notice} />
      ))}
    </ul>
  );
}
