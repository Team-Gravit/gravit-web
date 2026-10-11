import { createFileRoute } from '@tanstack/react-router';

import { InterviewSetupPage } from '@/pages/interview-setup';

import { getSessionSetupEntryHistoryIndex, guardSessionSetupStep } from './-interview-setup-route';

export const Route = createFileRoute('/_authenticated/_focus/interview/new/$step')({
  beforeLoad: guardSessionSetupStep,
  component: InterviewSetupRoute,
});

function InterviewSetupRoute() {
  // beforeLoad가 검증한 단계만 페이지에 넘긴다.
  const { step } = Route.useRouteContext();

  return <InterviewSetupPage step={step} entryHistoryIndex={getSessionSetupEntryHistoryIndex()} />;
}
