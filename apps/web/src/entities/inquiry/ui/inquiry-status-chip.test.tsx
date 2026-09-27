import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { InquiryStatusChip } from './inquiry-status-chip';

describe('InquiryStatusChip', () => {
  it('RESOLVED이면 「답변 완료」를 표시한다', () => {
    render(<InquiryStatusChip status="RESOLVED" />);
    expect(screen.getByText('답변 완료')).toBeInTheDocument();
  });

  it('PENDING이면 「답변 대기」를 표시한다', () => {
    render(<InquiryStatusChip status="PENDING" />);
    expect(screen.getByText('답변 대기')).toBeInTheDocument();
  });

  it('RESOLVED가 아닌 값은 「답변 대기」로 표시한다', () => {
    render(<InquiryStatusChip status="UNKNOWN" />);
    expect(screen.getByText('답변 대기')).toBeInTheDocument();
  });
});
