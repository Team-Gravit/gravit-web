import { noop } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getChaptersQueryOptions } from '@/entities/learning';
import { LearningPage } from '@/pages/learning';

export const Route = createFileRoute('/_authenticated/_app-shell/learning/')({
  staticData: { headerVariant: 'overlay' },
  // 챕터 목록을 화면 코드와 함께 받기 시작한다. 기다리지 않아 첫 렌더를 막지 않는다. (REF-062)
  loader: ({ context: { queryClient } }) => {
    void queryClient.query(getChaptersQueryOptions()).catch(noop);
  },
  component: LearningPage,
});
