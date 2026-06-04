import AddPlusIcon from '@/shared/assets/_icons/button/add-plus-icon.svg?react';
import { Button } from '@/shared/ui/button/Button';

import { useRecommendFollow } from './model/use-recommend-follow';

interface RecommendFriendFollowButtonProps {
  userId: number;
}

function RecommendFriendFollowButton({ userId }: RecommendFriendFollowButtonProps) {
  const { mutate: follow, isPending } = useRecommendFollow();

  return (
    <Button
      display="inline"
      onClick={() => follow({ userId })}
      disabled={isPending}
      variant="strokePrimary"
      size="lg"
      className="flex items-center justify-center gap-[1.5px] py-1 md:py-[6.5px] stroke-cta hover:stroke-white"
    >
      <AddPlusIcon className="size-2.5 md:size-6" />
      <span className="text-caption1 md:text-body1-normal">팔로우</span>
    </Button>
  );
}

export default RecommendFriendFollowButton;
