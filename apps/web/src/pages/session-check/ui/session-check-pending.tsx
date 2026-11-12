import { Spinner } from '@/shared/ui/spinner';

/** 진입 판정을 위해 사용자 정보를 기다리는 동안 보여준다. */
export function SessionCheckPending() {
  return (
    <div
      data-slot="session-check-pending"
      className="flex min-h-dvh items-center justify-center bg-bg-0 text-cta"
    >
      <Spinner size="lg" />
    </div>
  );
}
