import { createFileRoute } from '@tanstack/react-router';

// 로그인 후 목적지 자리. 화면 본체는 별도 작업이다.
export const Route = createFileRoute('/_authenticated/_app-shell/main')({
  staticData: { headerVariant: 'solid' },
  component: () => null,
});
