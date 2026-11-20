import { Outlet, createFileRoute } from '@tanstack/react-router';

// 온보딩 입력과 완료 화면의 공통 레이아웃 라우트.
export const Route = createFileRoute('/_authenticated/onboarding')({
  // 스와이프로 나가면 입력 중인 닉네임 · 프로필이 확인 없이 사라진다.
  staticData: { swipeBack: false },
  component: Outlet,
});
