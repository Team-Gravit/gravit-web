import { createFileRoute } from '@tanstack/react-router';

// 미션 「도전하러 가기」의 목적지 자리 (`docs/routes.md`). 화면 본체는 별도 이전 작업이다.
export const Route = createFileRoute('/_authenticated/_app-shell/my/friends/search')({
  component: () => null,
});
