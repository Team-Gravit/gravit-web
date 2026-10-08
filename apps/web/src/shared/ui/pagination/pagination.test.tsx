import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './pagination';

/** 넓은/좁은 화면을 고정한다. */
function stubViewport(isWide: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      matches: isWide,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Pagination', () => {
  it('totalPages가 1이면 아무것도 렌더하지 않는다', () => {
    stubViewport(true);
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('현재 페이지 버튼에 aria-current를 표시한다', () => {
    stubViewport(true);
    render(<Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '3 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '2 페이지' })).not.toHaveAttribute('aria-current');
  });

  it('페이지 번호를 누르면 그 번호로 onPageChange를 호출한다', async () => {
    stubViewport(true);
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: '2 페이지' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('다음을 누르면 다음 페이지로 이동한다', async () => {
    stubViewport(true);
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: '다음 페이지' }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('첫 페이지에서는 이전 버튼이 비활성이다', () => {
    stubViewport(true);
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
  });

  it('마지막 페이지에서는 다음 버튼이 비활성이다', () => {
    stubViewport(true);
    render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();
  });
});
