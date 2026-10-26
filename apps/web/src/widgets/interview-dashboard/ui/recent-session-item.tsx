import { Link } from '@tanstack/react-router';

import { Chip } from '@/shared/ui/chip';
import { RankBadge } from '@/shared/ui/rank-badge';
import {
  INTERVIEW_HISTORY_MODE_LABEL,
  formatSessionSummary,
  type InterviewSessionHistoryResponse,
} from '@/entities/interview';

export interface RecentSessionItemProps {
  session: InterviewSessionHistoryResponse;
}

export function RecentSessionItem({ session }: RecentSessionItemProps) {
  return (
    <li>
      <Link
        to="/interview/history/$sessionId"
        params={{ sessionId: String(session.sessionId) }}
        search={{ tab: 'summary' }}
        className="flex items-center gap-2 rounded-6 bg-bg-2 px-4 py-3 md:min-h-18.5 md:gap-5 md:rounded-8 md:bg-bg-1 transition-colors md:hover:bg-bg-2"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <RankBadge rank={session.sequence} />
          <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
            <span className="truncate text-label1 text-text-2 md:text-heading2">
              {INTERVIEW_HISTORY_MODE_LABEL[session.mode]}
            </span>
            <span className="truncate text-label2 text-text-4 md:text-label1">
              {formatSessionSummary(session)}
            </span>
          </div>
        </div>
        <Chip variant="outlined">{session.score}점</Chip>
      </Link>
    </li>
  );
}
