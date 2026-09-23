import { formatElapsedTime } from '@/shared/lib/date';
import { useElapsedSeconds } from '@/shared/lib/use-elapsed-seconds';
import { Icon } from '@/shared/ui/icon';

/**
 * 매초 갱신되는 상태를 이 컴포넌트 안에 가둬 문제 영역의 불필요한 렌더를 피한다.
 * 제출용 시간은 세션의 시작 시각으로 별도 계산한다.
 */
export function QuizTimer() {
  const elapsedSeconds = useElapsedSeconds();

  return (
    // role="timer"는 암묵적으로 aria-live="off"라 매초 변경을 읽지 않는다.
    <span
      role="timer"
      aria-label="경과 시간"
      className="flex items-center gap-0.5 text-main-1 bg-purple-100 h-6 md:h-11 px-2 md:px-3 rounded-8 md:rounded-[60px]"
    >
      <Icon name="timer" className="size-3.5 md:size-6" />
      <span className="min-w-10 md:min-w-15 text-label1 md:text-heading1">
        {formatElapsedTime(elapsedSeconds)}
      </span>
    </span>
  );
}
