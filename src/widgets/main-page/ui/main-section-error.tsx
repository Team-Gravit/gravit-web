import { cn } from '@/shared/lib/cn';

type MainSectionErrorProps = {
  className?: string;
  label: string;
  onRetry: () => void;
};

/**
 * 메인 위젯별 에러 UI의 연결 지점
 * TODO: shared/ui Error 컴포넌트를 구현하면 이 컴포넌트의 내부 구현 교체 예정.
 */
export default function MainSectionError({ className, label, onRetry }: MainSectionErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        'min-h-32 flex flex-col items-center justify-center gap-3 rounded-lg md:rounded-2xl bg-white p-5 text-text-2',
        className,
      )}
    >
      <p>{label}을 불러오지 못했어요.</p>
      <button type="button" className="text-main underline text-body1-normal" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}
