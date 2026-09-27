import { Chip } from '@/shared/ui/chip';

import { INQUIRY_STATUS_LABEL, isResolved } from '../model/inquiry-status';

interface InquiryStatusChipProps {
  status: string;
}

/** 답변 상태. 완료는 채운 칩(cta), 대기는 흐린 칩으로 시안과 맞춘다. */
export function InquiryStatusChip({ status }: InquiryStatusChipProps) {
  const resolved = isResolved(status);

  return (
    <Chip variant={resolved ? 'filled' : 'muted'}>
      {resolved ? INQUIRY_STATUS_LABEL.RESOLVED : INQUIRY_STATUS_LABEL.PENDING}
    </Chip>
  );
}
