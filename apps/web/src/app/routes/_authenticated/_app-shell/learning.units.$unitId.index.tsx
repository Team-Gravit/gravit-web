import { createFileRoute } from '@tanstack/react-router';

// LRN-03(레슨 목록)을 이전할 때까지 유닛 카드의 목적지만 제공한다.
export const Route = createFileRoute('/_authenticated/_app-shell/learning/units/$unitId/')({
  component: () => null,
});
