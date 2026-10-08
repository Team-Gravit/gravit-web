import { createFileRoute, redirect } from '@tanstack/react-router';

import { OnboardingSuccessPage } from '@/pages/onboarding-success';

export const Route = createFileRoute('/_authenticated/onboarding/success')({
  /** 제출 직후 전달된 history state가 없으면 온보딩으로 돌려보낸다. */
  beforeLoad: ({ location }) => {
    if (!location.state.fromOnboarding) {
      throw redirect({ to: '/onboarding' });
    }
  },
  component: OnboardingSuccessPage,
});
