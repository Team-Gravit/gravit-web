/**
 * 마이페이지 탭 콘텐츠 자리(스텁). 각 탭 이전 작업(Phase 2~5)에서 실제 화면으로 교체한다.
 */
export function MyTabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-20 text-body1-normal text-text-4">
      {label} 준비 중
    </div>
  );
}
