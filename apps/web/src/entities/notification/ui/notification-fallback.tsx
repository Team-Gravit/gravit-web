import { formatDateLabel } from '../lib/group-by-date';

export function NotificationFallback() {
  return (
    <div className="h-full flex-1 flex flex-col justify-between px-4 py-5 md:p-0">
      <span className="text-label2 md:text-body1-normal text-text-4">
        {formatDateLabel(new Date().toISOString())}
      </span>
      <div className="flex-col flex-1 flex items-center justify-center">
        <h4 className="text-heading1 mb-2 md:mb-3 text-text-1">알림이 없어요.</h4>
        <p className="text-label1 md:text-headline1 text-text-3-w">
          궁금한 점이 있다면 문의하기를 통해 남겨주세요.
        </p>
      </div>
    </div>
  );
}
