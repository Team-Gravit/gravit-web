import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { PageHeading } from '@/shared/ui/page-heading';
import { Pagination } from '@/shared/ui/pagination';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  INTERVIEW_HISTORY_EMPTY_MESSAGE,
  useInterviewSessionHistory,
  type InterviewHistorySort,
} from '@/entities/interview';
import { PageTitleBar } from '@/widgets/page-title-bar';

import { HistorySortToggle } from './history-sort-toggle';
import { SessionHistoryItem } from './session-history-item';

const PAGE_TITLE = '최근 응시 이력';
// 서버가 페이지당 10건을 준다. 조회 중에도 목록 자리를 같은 높이로 잡아 둔다.
const HISTORY_PAGE_SIZE = 10;

export interface InterviewHistoryPageProps {
  /** 1부터 센다. */
  page: number;
  sort: InterviewHistorySort;
  onPageChange: (page: number) => void;
  onSortChange: (sort: InterviewHistorySort) => void;
}

export function InterviewHistoryPage({
  page,
  sort,
  onPageChange,
  onSortChange,
}: InterviewHistoryPageProps) {
  const isWide = useIsWideViewport();

  return (
    <div data-slot="interview-history-page" className="flex min-h-full flex-col">
      {isWide ? null : (
        <PageTitleBar title={PAGE_TITLE} backTo={{ to: '/interview' }} backIcon="home" />
      )}
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-3 py-5 md:gap-8 md:px-8 md:pt-10 md:pb-50 xl:px-0">
        {isWide ? (
          <PageHeading
            title={PAGE_TITLE}
            description="응시 이력을 누르면 피드백 리포트를 확인할 수 있습니다."
            breadcrumbItems={[
              { label: 'AI면접', link: { to: '/interview' } },
              { label: PAGE_TITLE },
            ]}
            className="mb-2"
          />
        ) : null}
        <section aria-label={PAGE_TITLE} className="flex flex-col gap-3 md:gap-4">
          <HistorySortToggle
            sort={sort}
            onSortChange={onSortChange}
            className="border-b border-divider-1 px-4 pb-3 md:border-none md:px-0 md:pb-0 md:pl-1"
          />
          <HistoryList page={page} sort={sort} onPageChange={onPageChange} isWide={isWide} />
        </section>
      </main>
    </div>
  );
}

interface HistoryListProps {
  page: number;
  sort: InterviewHistorySort;
  onPageChange: (page: number) => void;
  isWide: boolean;
}

function HistoryList({ page, sort, onPageChange, isWide }: HistoryListProps) {
  const { data: historyPage, isPending, isError, refetch } = useInterviewSessionHistory(page, sort);

  if (isPending) {
    return (
      <ul aria-busy="true" className="flex flex-col gap-3 px-4 md:px-0">
        {Array.from({ length: HISTORY_PAGE_SIZE }, (_, index) => (
          <li key={index}>
            <Skeleton variant="block" className="h-14.75 rounded-8 md:h-18.5" />
          </li>
        ))}
      </ul>
    );
  }
  if (isError) {
    return (
      <CardRetryStatus sectionName="응시 이력" onRetry={() => void refetch()} className="py-20" />
    );
  }
  if (historyPage.contents.length === 0) {
    return (
      <CardStatus message={INTERVIEW_HISTORY_EMPTY_MESSAGE} className="whitespace-pre-line py-20" />
    );
  }

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <ol className="flex flex-col gap-3 px-4 md:px-0">
        {historyPage.contents.map((session) => (
          <SessionHistoryItem
            key={session.sessionId}
            session={session}
            dateFormat={isWide ? 'long' : 'dotted'}
          />
        ))}
      </ol>
      <Pagination
        currentPage={page}
        totalPages={historyPage.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
