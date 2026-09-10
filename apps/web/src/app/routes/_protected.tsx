import { Outlet, createFileRoute } from '@tanstack/react-router';

// 인증·온보딩 판정은 후속 작업에서 beforeLoad로 넣는다. 지금은 경로 그룹만 만든다.
export const Route = createFileRoute('/_protected')({
  component: Outlet,
});
