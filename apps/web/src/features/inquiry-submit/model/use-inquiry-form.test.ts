import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useInquiryForm } from './use-inquiry-form';

describe('useInquiryForm', () => {
  it('초기에는 유효하지 않다', () => {
    const { result } = renderHook(() => useInquiryForm());

    expect(result.current.isValid).toBe(false);
  });

  it('유형·제목·내용이 모두 채워지면 유효하다', () => {
    const { result } = renderHook(() => useInquiryForm());

    act(() => result.current.update('type', 'BUG_REPORT'));
    act(() => result.current.update('title', '제목'));
    act(() => result.current.update('content', '내용'));

    expect(result.current.isValid).toBe(true);
    expect(result.current.values).toEqual({
      type: 'BUG_REPORT',
      title: '제목',
      content: '내용',
    });
  });

  it('하나라도 비어 있으면 유효하지 않다', () => {
    const { result } = renderHook(() => useInquiryForm());

    act(() => result.current.update('type', 'BUG_REPORT'));
    act(() => result.current.update('title', '제목'));

    expect(result.current.isValid).toBe(false);
  });
});
