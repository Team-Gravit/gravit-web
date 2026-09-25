import { createFileRoute } from '@tanstack/react-router';

// 공지사항 화면 본체는 별도 이전 작업이다. 설정 목록의 링크 목적지만 확보한다.
export const Route = createFileRoute('/_authenticated/settings/notice')({
  component: () => null,
});
