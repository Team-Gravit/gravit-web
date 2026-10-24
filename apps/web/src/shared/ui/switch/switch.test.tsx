import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from './switch';

describe('Switch', () => {
  it('클릭하면 onCheckedChange 가 반대값으로 호출된다', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('checked 가 true 면 클릭 시 false 로 호출된다', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('disabled 면 클릭해도 onCheckedChange 가 호출되지 않는다', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} disabled onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('checked 상태가 aria-checked 로 노출된다', () => {
    render(<Switch checked onCheckedChange={vi.fn()} />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
