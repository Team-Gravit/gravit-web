import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useFollowRecommendedUser } from '../api/use-follow-recommended-user';

interface RecommendFollowButtonProps {
  userId: number;
  onFollowed?: () => void;
}

/**
 * 추천 친구를 팔로우하는 버튼. 성공해도 카드는 유지되고, 추천 위젯이 버튼을 언팔로우로 토글한다.
 *
 * 모양이 모바일(채운 CTA·아이콘 없음)과 데스크톱(흰 배경·테두리·add 아이콘)에서 완전히 달라
 * 단일 variant 로 표현할 수 없어, 브레이크포인트별로 shared Button 을 각각 렌더한다.
 */
export function RecommendFollowButton({ userId, onFollowed }: RecommendFollowButtonProps) {
  const { mutate: follow, isPending } = useFollowRecommendedUser();
  const handleFollow = () => follow({ userId }, { onSuccess: () => onFollowed?.() });

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={handleFollow}
        disabled={isPending}
        className="w-full rounded-8 text-label2 md:hidden"
      >
        팔로우
      </Button>
      <Button
        variant="stroke-default"
        size="sm"
        onClick={handleFollow}
        disabled={isPending}
        className="hidden gap-1 rounded-6 bg-white text-body1-normal md:flex"
      >
        <Icon name="plus-lg" className="size-6" />
        팔로우
      </Button>
    </>
  );
}
