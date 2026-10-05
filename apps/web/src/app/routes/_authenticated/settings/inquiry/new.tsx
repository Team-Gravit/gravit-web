import { createFileRoute } from '@tanstack/react-router';

import { InquiryNewPage } from '@/pages/inquiry-new';

export const Route = createFileRoute('/_authenticated/settings/inquiry/new')({
  component: InquiryNewPage,
});
