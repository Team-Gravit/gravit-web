import { describe, expect, it } from 'vitest';

import { getInquiryTypeLabel } from './inquiry-type';

describe('getInquiryTypeLabel', () => {
  it('알려진 유형 코드는 한국어 라벨로 변환한다', () => {
    expect(getInquiryTypeLabel('BUG_REPORT')).toBe('버그 신고');
    expect(getInquiryTypeLabel('FEATURE_SUGGESTION')).toBe('기능 제안');
  });

  it('알 수 없는 유형 코드는 기타로 변환한다', () => {
    expect(getInquiryTypeLabel('WHATEVER')).toBe('기타');
  });
});
