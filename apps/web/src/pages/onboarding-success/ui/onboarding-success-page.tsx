import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { OnboardingSuccessPageNarrow } from './onboarding-success-page-narrow';
import { OnboardingSuccessPageWide } from './onboarding-success-page-wide';

// 접근 조건은 라우트에서 확인한다.
export function OnboardingSuccessPage() {
  const isWide = useIsWideViewport();

  return isWide ? <OnboardingSuccessPageWide /> : <OnboardingSuccessPageNarrow />;
}
