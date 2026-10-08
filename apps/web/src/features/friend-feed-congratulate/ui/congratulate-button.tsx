import { Button } from '@/shared/ui/button';

import { useCongratulate } from '../api/use-congratulate-feed';

interface CongratulateButtonProps {
  feedId: number;
  /** 이미 축하했는지 여부. true면 '축하 완료'로 비활성. */
  congratulated: boolean;
  /** 지금 축하 가능한지. 완료했거나 하루 3회 소진 시 false. */
  canCongratulate: boolean;
}

/** 피드 항목 축하하기 버튼. 축하 완료·불가 상태는 서버 값(congratulated/canCongratulate)을 따른다. */
export function CongratulateButton({
  feedId,
  congratulated,
  canCongratulate,
}: CongratulateButtonProps) {
  const { mutate: congratulate, isPending } = useCongratulate();

  return (
    <Button
      size="sm"
      disabled={congratulated || !canCongratulate || isPending}
      onClick={() => congratulate({ feedId })}
      className="shrink-0 text-label2 md:text-body1-normal"
    >
      {congratulated ? '축하 완료' : '축하하기'}
    </Button>
  );
}
