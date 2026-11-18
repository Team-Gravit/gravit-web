import { createFileRoute } from '@tanstack/react-router';

import { SPACE_TOP_COLOR } from '@/shared/config';
import { LeaguePage } from '@/pages/league';

export const Route = createFileRoute('/_authenticated/_app-shell/league')({
  staticData: {
    headerVariant: 'overlay',
    statusBarStyle: 'light',
    browserTopColor: SPACE_TOP_COLOR,
    // 탭 최상위라 돌아갈 화면이 없다. 탭 이동이 쌓은 기록으로 직전 탭에 가지 않게 한다.
    swipeBack: false,
  },
  component: LeaguePage,
});
