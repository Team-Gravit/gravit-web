import { createFileRoute, redirect } from '@tanstack/react-router';

import { getUserQueryOptions } from '@/entities/user';
import { OnboardingPage } from '@/pages/onboarding';

export const Route = createFileRoute('/_protected/onboarding/')({
  /** 완료한 사용자는 온보딩 대신 메인 화면으로 보낸다. */
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getUserQueryOptions()).catch(() => null);

    if (user?.isOnboarded) {
      throw redirect({ to: '/main' });
    }
  },
  component: OnboardingPage,
});
