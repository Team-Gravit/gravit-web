import { createFileRoute } from '@tanstack/react-router';

import { InterviewPage } from '@/pages/interview';

export const Route = createFileRoute('/_authenticated/_app-shell/interview/')({
  component: InterviewPage,
});
