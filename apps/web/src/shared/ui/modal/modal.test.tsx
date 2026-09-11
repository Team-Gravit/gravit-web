import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal, ModalTitle } from './modal';

describe('Modal', () => {
  it('open이면 제목이 접근 가능한 dialog로 렌더된다', () => {
    render(
      <Modal open>
        <ModalTitle>시즌 종료!</ModalTitle>
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: '시즌 종료!' })).toBeInTheDocument();
  });

  it('dismissible이 false면 Esc로 닫히지 않는다', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal open dismissible={false} onOpenChange={onOpenChange}>
        <ModalTitle>시즌 종료!</ModalTitle>
      </Modal>,
    );

    await user.keyboard('{Escape}');

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
