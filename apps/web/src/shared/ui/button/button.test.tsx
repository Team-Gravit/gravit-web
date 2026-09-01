import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './button';

describe('Button', () => {
  it('클릭하면 onClick 이 호출된다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);

    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('isLoading', () => {
    it('isLoading 이면 aria-busy 가 켜지고 버튼이 비활성된다', () => {
      render(<Button isLoading>확인</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });

    it('isLoading 이면 클릭해도 onClick 이 호출되지 않는다', async () => {
      const onClick = vi.fn();
      render(
        <Button isLoading onClick={onClick}>
          확인
        </Button>,
      );

      await userEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('isLoading 이어도 레이블은 폭 유지를 위해 DOM 에 남는다', () => {
      render(<Button isLoading>확인</Button>);

      expect(screen.getByText('확인')).toBeInTheDocument();
    });
  });

  describe('asChild', () => {
    it('asChild 면 button 이 아니라 자식 엘리먼트로 렌더된다', () => {
      render(
        <Button asChild>
          <a href="/home">홈</a>
        </Button>,
      );

      expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    // FIX-001: asChild 일 때 Slot 에 넘어가는 자식이 Fragment 라서 className·data-slot·
    // aria-disabled 가 전부 유실된다. 현재 <a> 는 버튼 스타일 없이 맨몸으로 렌더된다.
    // 고쳐지면 이 테스트가 "통과"해서 it.fails 가 실패하므로, 그때 .fails 를 떼면 된다.
    // 상세: work/to-do/FIX-001-button-aschild-slot/spec.md
    it.fails('asChild 면 버튼 스타일과 aria-disabled 가 자식 엘리먼트에 적용된다', () => {
      render(
        <Button asChild disabled>
          <a href="/home">홈</a>
        </Button>,
      );

      const link = screen.getByRole('link', { name: '홈' });

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-slot', 'button');
    });
  });
});
