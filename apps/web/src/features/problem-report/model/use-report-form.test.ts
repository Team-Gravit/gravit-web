import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useReportForm } from './use-report-form';

describe('useReportForm', () => {
  it('처음에는 유형이 없고 사유가 비어 있어 제출할 수 없다', () => {
    const { result } = renderHook(() => useReportForm());

    expect(result.current.reportType).toBeNull();
    expect(result.current.content).toBe('');
    expect(result.current.canSubmit).toBe(false);
  });

  it('유형만 고르면 제출할 수 없다 (AC-3a)', () => {
    const { result } = renderHook(() => useReportForm());

    act(() => result.current.setReportType('TYPO_ERROR'));

    expect(result.current.canSubmit).toBe(false);
  });

  it('유형을 골라도 사유가 공백뿐이면 제출할 수 없다 (AC-3b)', () => {
    const { result } = renderHook(() => useReportForm());

    act(() => result.current.setReportType('TYPO_ERROR'));
    act(() => result.current.setContent('   \n '));

    expect(result.current.canSubmit).toBe(false);
  });

  it('유형과 사유가 있으면 제출할 수 있다 (AC-3c)', () => {
    const { result } = renderHook(() => useReportForm());

    act(() => result.current.setReportType('TYPO_ERROR'));
    act(() => result.current.setContent('오타 있음'));

    expect(result.current.canSubmit).toBe(true);
  });

  it('다른 유형을 고르면 마지막 하나만 남는다 (AC-4)', () => {
    const { result } = renderHook(() => useReportForm());

    act(() => result.current.setReportType('TYPO_ERROR'));
    act(() => result.current.setReportType('ANSWER_ERROR'));

    expect(result.current.reportType).toBe('ANSWER_ERROR');
  });

  it('resetForm을 호출하면 유형과 사유를 비운다', () => {
    const { result } = renderHook(() => useReportForm());

    act(() => result.current.setReportType('OTHER_ERROR'));
    act(() => result.current.setContent('기타 사유'));
    act(() => result.current.resetForm());

    expect(result.current.reportType).toBeNull();
    expect(result.current.content).toBe('');
  });
});
