import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
} from '@/shared/api/@generated/friend-api/friend-api';
import {
  getGetRecommendedUsersQueryKey,
  useFollow,
} from '@/shared/api/@generated/social-api/social-api';
import AddPlusIcon from '@/shared/assets/_icons/button/add-plus-icon.svg?react';
import { Button } from '@/shared/ui/button/Button';

interface RecommendFriendFollowButtonProps {
  userId: number;
}

function RecommendFriendFollowButton({ userId }: RecommendFriendFollowButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: recommendFriendFollow, isPending: isRecommendFriendFollowPending } = useFollow({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetRecommendedUsersQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });
      },
      onError: (error) => {
        //TODO: 에러 핸들링 로직 추가
        console.log(error, 'failed recommend friend follow');
      },
    },
  });

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
