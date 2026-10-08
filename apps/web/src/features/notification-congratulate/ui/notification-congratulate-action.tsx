import { useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import { useCongratulateFromNotification } from '../api/use-congratulate-from-notification';

interface NotificationCongratulateActionProps {
  /** 축하 대상 피드(targetId). */
  feedId: number;
  /** 서버 기준 축하 완료 여부. */
  congratulated: boolean;
  layout: 'card' | 'popover';
}

/**
 * FRIEND_ACTIVITY 알림의 축하 버튼. 축하하면 '축하 완료'로 바뀌고 비활성된다.
 * 인박스가 refetch 돼 서버 값이 바뀌면 그 값으로 되돌린다(렌더 중 상태 조정).
 */
export function NotificationCongratulateAction({
  feedId,
  congratulated,
  layout,
}: NotificationCongratulateActionProps) {
  const [done, setDone] = useState(congratulated);
  const [prevCongratulated, setPrevCongratulated] = useState(congratulated);
  if (prevCongratulated !== congratulated) {
    setPrevCongratulated(congratulated);
    setDone(congratulated);
  }

  const { mutate: congratulate, isPending } = useCongratulateFromNotification({
    onSuccess: () => setDone(true),
  });

  const sizeClass =
    layout === 'popover' ? 'h-[37px] px-5 text-body1-normal' : 'h-8 px-4 text-label2';

  return (
    <Button
      type="button"
      variant={done ? 'stroke-secondary' : 'default'}
      size="sm"
      disabled={done || isPending}
      onClick={() => congratulate({ feedId })}
      className={cn('w-full', sizeClass)}
    >
      {done ? '축하 완료' : '축하하기'}
    </Button>
  );
}
