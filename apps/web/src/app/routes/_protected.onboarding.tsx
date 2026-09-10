import { createFileRoute } from '@tanstack/react-router';

// 온보딩 미완료자의 목적지 자리. 화면 본체는 별도 작업이다.
export const Route = createFileRoute('/_protected/onboarding')({
  component: () => null,
});
