import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { InfoTooltip } from './info-tooltip';

// Radix Popover 가 위치 계산에 ResizeObserver 를 쓰는데 jsdom 에는 없다. 테스트 대상이 아니므로 no-op stub.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const renderTooltip = () =>
  render(<InfoTooltip content="자료를 다루는 방법" label="자료구조 설명 보기" />);

describe('InfoTooltip', () => {
  it('누르면 설명을 열고 다시 누르면 닫는다', async () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '자료구조 설명 보기' });

    await userEvent.click(trigger);
    expect(screen.getByText('자료를 다루는 방법')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(trigger);
    await waitFor(() => expect(screen.queryByText('자료를 다루는 방법')).not.toBeInTheDocument());
  });

  it('마우스를 잠시 올려 두면 열고 떼면 닫는다', async () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '자료구조 설명 보기' });

    await userEvent.hover(trigger);
    expect(await screen.findByText('자료를 다루는 방법')).toBeInTheDocument();

    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByText('자료를 다루는 방법')).not.toBeInTheDocument());
  });

  it('커서가 잠깐 지나가기만 하면 열지 않는다', async () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '자료구조 설명 보기' });

    await userEvent.hover(trigger);
    await userEvent.unhover(trigger);
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(screen.queryByText('자료를 다루는 방법')).not.toBeInTheDocument();
  });

  it('클릭으로 연 설명은 마우스를 떼도 남고 Escape 로 닫힌다', async () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '자료구조 설명 보기' });

    await userEvent.hover(trigger);
    await userEvent.click(trigger);
    await userEvent.unhover(trigger);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.getByText('자료를 다루는 방법')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('자료를 다루는 방법')).not.toBeInTheDocument());
  });

  it('클릭으로 연 설명도 스크롤하면 닫힌다', async () => {
    renderTooltip();

    await userEvent.click(screen.getByRole('button', { name: '자료구조 설명 보기' }));
    expect(screen.getByText('자료를 다루는 방법')).toBeInTheDocument();

    fireEvent.scroll(window);
    await waitFor(() => expect(screen.queryByText('자료를 다루는 방법')).not.toBeInTheDocument());
  });

  it('마우스를 올린 직후 스크롤하면 열지 않는다', async () => {
    renderTooltip();

    await userEvent.hover(screen.getByRole('button', { name: '자료구조 설명 보기' }));
    fireEvent.scroll(window);
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(screen.queryByText('자료를 다루는 방법')).not.toBeInTheDocument();
  });

  it('키보드 Enter 로 연다', async () => {
    renderTooltip();

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(screen.getByText('자료를 다루는 방법')).toBeInTheDocument();
  });
});
