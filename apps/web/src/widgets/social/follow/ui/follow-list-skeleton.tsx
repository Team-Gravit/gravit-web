import { Skeleton } from '@/shared/ui/skeleton';

/** 팔로우 목록 로딩 스켈레톤. 아바타 + 닉네임 자리를 6줄 미러링한다. */
export function FollowListSkeleton() {
  return (
    <ul className="flex flex-col">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 px-6 py-3">
          <Skeleton variant="circular" className="size-12" />
          <Skeleton variant="block" className="h-6 w-25 rounded-8" />
        </li>
      ))}
    </ul>
  );
}
