import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { InterviewPageNarrow } from './interview-page-narrow';
import { InterviewPageWide } from './interview-page-wide';

export function InterviewPage() {
  const isWide = useIsWideViewport();

  return isWide ? <InterviewPageWide /> : <InterviewPageNarrow />;
}
