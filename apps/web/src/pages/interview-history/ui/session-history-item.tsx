import { Link } from '@tanstack/react-router';

import { Chip } from '@/shared/ui/chip';
import { RankBadge } from '@/shared/ui/rank-badge';
import {
  INTERVIEW_HISTORY_MODE_LABEL,
  formatSessionHistoryDetail,
  type InterviewSessionHistoryResponse,
  type SessionDateFormat,
} from '@/entities/interview';

export interface SessionHistoryItemProps {
  session: InterviewSessionHistoryResponse;
  dateFormat: SessionDateFormat;
}

export function SessionHistoryItem({ session, dateFormat }: SessionHistoryItemProps) {
  return (
    <li>
      <Link
        to="/interview/history/$sessionId"
        params={{ sessionId: String(session.sessionId) }}
        search={{ tab: 'summary' }}
        className="flex items-center gap-5 rounded-8 bg-bg-0 px-4 py-3 md:min-h-18.5 transition-colors hover:bg-bg-1"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <RankBadge rank={session.sequence} />
          <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
            <span className="truncate text-label1 text-text-2 md:text-heading2">
              {INTERVIEW_HISTORY_MODE_LABEL[session.mode]}
            </span>
            <span className="truncate text-label2 text-text-4 md:text-label1">
              {formatSessionHistoryDetail(session, dateFormat)}
            </span>
          </div>
        </div>
        <Chip variant="outlined" className="shrink-0">
          {session.score}점
        </Chip>
      </Link>
    </li>
  );
}
