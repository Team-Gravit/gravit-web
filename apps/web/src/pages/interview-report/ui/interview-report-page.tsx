import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { PageHeading } from '@/shared/ui/page-heading';
import { Tabs } from '@/shared/ui/tab';
import {
  REPORT_TAB_LABEL,
  formatSessionDate,
  useInterviewSessionSummary,
  type ReportTab,
} from '@/entities/interview';
import { PageTitleBar } from '@/widgets/page-title-bar';

import { AnswerDetailsTab } from './answer-details-tab';
import { SessionSummaryTab } from './session-summary-tab';

const PAGE_TITLE = '피드백 리포트';
const REPORT_TABS: ReportTab[] = ['summary', 'answers'];
const HISTORY_LINK = { to: '/interview/history', search: { page: 1, sort: 'LATEST' } } as const;

export interface InterviewReportPageProps {
  sessionId: number;
  tab: ReportTab;
  question?: number;
  onQuestionSelect: (displayOrder: number) => void;
}

export function InterviewReportPage({
  sessionId,
  tab,
  question,
  onQuestionSelect,
}: InterviewReportPageProps) {
  const isWide = useIsWideViewport();
  const layout = isWide ? 'wide' : 'narrow';
  // 날짜는 세션 종합 응답에서 읽는다. 세션 종합 탭과 같은 queryKey라 요청은 한 번이다.
  const { data: summary } = useInterviewSessionSummary(sessionId);

  return (
    <div data-slot="interview-report-page" className="flex min-h-full flex-col">
      {isWide ? null : <PageTitleBar title={PAGE_TITLE} backTo={HISTORY_LINK} backIcon="home" />}
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-3 px-4 pt-5 pb-10 md:gap-8 md:px-8 md:pt-10 md:pb-50 xl:px-0">
        {isWide ? (
          <PageHeading
            title={PAGE_TITLE}
            description={summary ? formatSessionDate(summary.startedAt, 'compact') : undefined}
            breadcrumbItems={[
              { label: 'AI면접', link: { to: '/interview' } },
              { label: '최근 응시 이력', link: HISTORY_LINK },
              { label: PAGE_TITLE },
            ]}
            className="mb-2"
          />
        ) : null}
        <Tabs>
          {REPORT_TABS.map((reportTab) => (
            <Tabs.Tab
              key={reportTab}
              to="/interview/history/$sessionId"
              params={{ sessionId: String(sessionId) }}
              search={{ tab: reportTab }}
              activeOptions={{ includeSearch: true }}
              replace
            >
              {REPORT_TAB_LABEL[reportTab]}
            </Tabs.Tab>
          ))}
        </Tabs>
        {!isWide && summary ? (
          <span className="-mb-1 text-caption2 text-text-4">
            {formatSessionDate(summary.startedAt, 'dotted')}
          </span>
        ) : null}
        {tab === 'summary' ? (
          <SessionSummaryTab
            sessionId={sessionId}
            layout={layout}
            onQuestionSelect={onQuestionSelect}
          />
        ) : (
          <AnswerDetailsTab
            sessionId={sessionId}
            question={question}
            onQuestionSelect={onQuestionSelect}
            layout={layout}
          />
        )}
      </main>
    </div>
  );
}
