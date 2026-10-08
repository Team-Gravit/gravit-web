import { Outlet, createFileRoute } from '@tanstack/react-router';

// 온보딩 입력과 완료 화면의 공통 레이아웃 라우트.
export const Route = createFileRoute('/_authenticated/onboarding')({
  component: Outlet,
});
