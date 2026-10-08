import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { OnboardingForm } from './onboarding-form';
import { useOnboardingForm } from '../model/use-onboarding-form';

const ONBOARDING_ENDPOINT = '*/api/v1/users/onboarding';

function renderOnboardingForm(secondaryAction?: ReactNode) {
  const onSuccess = vi.fn();
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  function TestForm() {
    const form = useOnboardingForm({ onSuccess });
    return <OnboardingForm form={form} secondaryAction={secondaryAction} />;
  }

  render(
    <QueryClientProvider client={queryClient}>
      <TestForm />
    </QueryClientProvider>,
  );

  return { onSuccess, user: userEvent.setup() };
}

describe('OnboardingForm', () => {
  it('입력 전에는 「다음」이 비활성이고 규칙 안내가 보인다', () => {
    renderOnboardingForm();

    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
    expect(screen.getByText('*글자수 2~8자')).toBeInTheDocument();
    expect(screen.getByText('*공백, 특수문자 제외')).toBeInTheDocument();
  });

  it('규칙에 어긋난 닉네임을 넣으면 사용할 수 없다고 알리고 「다음」이 계속 비활성이다', async () => {
    const { user } = renderOnboardingForm();

    await user.type(screen.getByRole('textbox'), '!!!');

    expect(await screen.findByText('사용할 수 없는 닉네임이에요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('규칙에 맞는 닉네임을 넣으면 사용 가능으로 알리고 「다음」이 활성된다', async () => {
    const { user } = renderOnboardingForm();

    await user.type(screen.getByRole('textbox'), '그래빗');

    expect(await screen.findByText('사용 가능한 닉네임이에요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });

  it('제출하면 요청이 한 번 나가고 onSuccess 가 호출된다', async () => {
    let requestCount = 0;
    server.use(
      http.post(ONBOARDING_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({ userId: 1, isOnboarded: true });
      }),
    );

    const { user, onSuccess } = renderOnboardingForm();

    await user.type(screen.getByRole('textbox'), '그래빗');
    await screen.findByText('사용 가능한 닉네임이에요.');
    await user.click(screen.getByRole('button', { name: '다음' }));

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(requestCount).toBe(1);
  });

  it('보조 조작을 주면 「다음」과 함께 렌더된다', () => {
    renderOnboardingForm(<button type="button">이전</button>);

    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('색 선택기의 좌우 조작에 접근 가능한 이름이 있다', () => {
    renderOnboardingForm();

    expect(screen.getByRole('button', { name: '이전 프로필 색' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 프로필 색' })).toBeInTheDocument();
  });
});
