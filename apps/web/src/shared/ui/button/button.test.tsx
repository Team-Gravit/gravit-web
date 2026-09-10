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

    it('asChild 면 버튼 스타일과 aria-disabled 가 자식 엘리먼트에 적용된다', () => {
      render(
        <Button asChild disabled className="probe-class">
          <a href="/home">홈</a>
        </Button>,
      );

      const link = screen.getByRole('link', { name: '홈' });

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-slot', 'button');
      expect(link).toHaveAttribute('data-variant', 'default');
      expect(link).toHaveClass('probe-class');
    });

    it('asChild 에 startIcon 을 주면 아이콘과 레이블이 한 엘리먼트 안에 함께 들어간다', () => {
      render(
        <Button asChild startIcon={<span data-testid="start-icon" />}>
          <a href="/home">홈</a>
        </Button>,
      );

      const links = screen.getAllByRole('link', { name: '홈' });

      expect(links).toHaveLength(1);
      expect(links[0]).toContainElement(screen.getByTestId('start-icon'));
    });

    it('asChild 와 isLoading 은 함께 쓸 수 없다', () => {
      // 로딩 표시는 레이블을 <span> 으로 감싸 폭을 유지하는데, 그러면 Slottable 이 Slot 의
      // 직속 자식에서 사라진다. 타입 수준에서 막는 것이 이 컴포넌트의 계약이다.
      const invalid = (
        // @ts-expect-error asChild 는 isLoading 과 배타다
        <Button asChild isLoading>
          <a href="/home">홈</a>
        </Button>
      );

      expect(invalid).toBeTruthy();
    });
  });
});
