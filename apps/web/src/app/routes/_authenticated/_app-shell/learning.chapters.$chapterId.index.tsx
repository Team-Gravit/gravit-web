import { createFileRoute } from '@tanstack/react-router';

// LRN-02(유닛 목록)를 이전할 때까지 챕터 카드의 목적지만 제공한다.
export const Route = createFileRoute('/_authenticated/_app-shell/learning/chapters/$chapterId/')({
  component: () => null,
});
