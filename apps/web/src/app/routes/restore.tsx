import { createFileRoute } from '@tanstack/react-router';

// 탈퇴 계정 복구 목적지 자리. 화면 본체는 별도 작업이다. (기준선 D6)
export const Route = createFileRoute('/restore')({
  component: () => null,
  validateSearch: (search: Record<string, unknown>): { providerId: string } => ({
    providerId: typeof search.providerId === 'string' ? search.providerId : '',
  }),
});
