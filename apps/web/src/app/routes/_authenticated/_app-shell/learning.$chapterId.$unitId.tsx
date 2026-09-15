import { createFileRoute } from '@tanstack/react-router';

// 「이어서 학습하기」 · 유닛 카드의 목적지 자리 (`docs/routes.md` LRN-03). 화면 본체는 별도 이전 작업이다.
export const Route = createFileRoute('/_authenticated/_app-shell/learning/$chapterId/$unitId')({
  component: () => null,
});
