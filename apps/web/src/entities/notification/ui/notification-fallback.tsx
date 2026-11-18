import { CardStatus } from '@/shared/ui/card';

import { formatDateLabel } from '../lib/group-by-date';

const EMPTY_MESSAGE = '알림이 없어요.\n궁금한 점이 있다면 문의하기를 통해 남겨 주세요.';

export function NotificationFallback() {
  return (
    <div className="h-full flex-1 flex flex-col justify-between px-4 py-5 md:p-0">
      <span className="text-label2 md:text-body1-normal text-text-4">
        {formatDateLabel(new Date().toISOString())}
      </span>
      <CardStatus message={EMPTY_MESSAGE} className="whitespace-pre-line" />
    </div>
  );
}
