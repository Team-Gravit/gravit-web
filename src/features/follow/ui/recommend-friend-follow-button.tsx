import AddPlusIcon from '@/shared/assets/_icons/button/add-plus-icon.svg?react';
import { Button } from '@/shared/ui/button/Button';

import { useFollowRecommendUser } from '../model/use-follow-recommend-user';

interface RecommendFriendFollowButtonProps {
  userId: number;
}

function RecommendFriendFollowButton({ userId }: RecommendFriendFollowButtonProps) {
  const { mutate: recommendFriendFollow, isPending: isRecommendFriendFollowPending } =
    useFollowRecommendUser();

  return (
    <Button
      onClick={() => recommendFriendFollow({ userId })}
      disabled={isRecommendFriendFollowPending}
      variant={'strokePrimary'}
      size="custom"
      className="bg-transparent text-cta flex items-center justify-center stroke-cta gap-[1.5px] hover:stroke-white px-5 py-1 md:py-[6.5px] rounded-sm md:rounded-lg"
    >
      <AddPlusIcon className="size-2.5 md:size-6" />
      <span className="text-caption1 md:text-body1-normal">팔로우</span>
    </Button>
  );
}

export default RecommendFriendFollowButton;
