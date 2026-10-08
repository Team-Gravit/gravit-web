import { useNavigate } from '@tanstack/react-router';

import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { useOnboardingForm } from '@/features/user-onboarding';

import { OnboardingPageNarrow } from './onboarding-page-narrow';
import { OnboardingPageWide } from './onboarding-page-wide';

// 화면 너비에 따라 데스크톱·모바일 레이아웃을 선택한다.
export function OnboardingPage() {
  const isWide = useIsWideViewport();
  const navigate = useNavigate();
  // 레이아웃이 바뀌어도 폼 상태를 유지한다.
  const form = useOnboardingForm({
    // 완료 화면은 제출 직후에만 접근할 수 있도록 replace로 이동한다.
    onSuccess: () =>
      navigate({
        to: '/onboarding/success',
        replace: true,
        state: { fromOnboarding: true },
      }),
  });

  return isWide ? <OnboardingPageWide form={form} /> : <OnboardingPageNarrow form={form} />;
}
