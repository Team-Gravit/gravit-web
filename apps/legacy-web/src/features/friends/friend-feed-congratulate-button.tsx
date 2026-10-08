import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFeedInfiniteQueryKey,
  useCongratulateFeed,
  useHideFeed,
} from '@/shared/api/@generated/social-api/social-api';
import { Button } from '@/shared/ui/button/Button';

interface FriendFeedCongratulateButtonProps {
  feedId: number;
}

function FriendFeedCongratulateButton({ feedId }: FriendFeedCongratulateButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: hideFeed } = useHideFeed({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFeedInfiniteQueryKey(),
        });
      },
    },
  });

  const { mutate: congratulateFeed, isPending: isCongratulatePending } = useCongratulateFeed({
    mutation: {
      onSuccess: (_, { feedId }) => {
        // 성공 시 후속 처리
        console.log('congratulate success');
        hideFeed({ feedId });
      },
      onError: (error) => {
        // 에러 시 후속 처리
        console.log('congratulate error', error);
      },
    },
  });

  return (
    <Button
      size="custom"
      disabled={isCongratulatePending}
      onClick={() => congratulateFeed({ feedId })}
      display="block"
      className="rounded-lg text-label2 md:text-body1-normal text-cta-text px-4 md:px-5 py-2 md:py-1.75"
    >
      축하하기
    </Button>
  );
}

export default FriendFeedCongratulateButton;
