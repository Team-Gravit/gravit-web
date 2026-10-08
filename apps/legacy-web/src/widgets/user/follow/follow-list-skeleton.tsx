export default function FollowListSkeleton() {
  return (
    <ul className="flex flex-col">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="flex items-center justify-start gap-3 px-6 py-3">
          <div className="size-12 rounded-full animate-pulse bg-bg-3" />
          <div className="w-25 rounded-lg animate-pulse bg-bg-3 h-[25px]" />
        </li>
      ))}
    </ul>
  );
}
