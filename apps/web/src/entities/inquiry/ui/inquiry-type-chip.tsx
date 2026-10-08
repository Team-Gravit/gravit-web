import { Chip } from '@/shared/ui/chip';

import { getInquiryTypeLabel } from '../model/inquiry-type';

interface InquiryTypeChipProps {
  type: string;
  className?: string;
}

/** 문의 유형 라벨. 시안 유형 칩(테두리 cta)을 공통 `Chip`의 outlined로 표현한다. */
export function InquiryTypeChip({ type, className }: InquiryTypeChipProps) {
  return (
    <Chip variant="outlined" className={className}>
      {getInquiryTypeLabel(type)}
    </Chip>
  );
}
