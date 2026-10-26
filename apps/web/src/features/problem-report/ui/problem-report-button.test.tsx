import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, delay, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { Toaster } from '@/shared/ui/toast';

import { ProblemReportButton } from './problem-report-button';

const REPORT_URL = '*/api/v1/reports';
const REPORT_TYPE_LABELS = [
  '문제/선지에 오탈자가 있습니다.',
  '문제 자체에 오류가 있습니다.',
  '답안에 오류가 있습니다.',
  '기타',
];

function mockReportSubmission(status = 200) {
  const requestBodies: unknown[] = [];
  server.use(
    http.post(REPORT_URL, async ({ request }) => {
      requestBodies.push(await request.json());
      return new HttpResponse(null, { status });
    }),
  );
  return requestBodies;
}

function renderProblemReportButton(problemId = 42) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProblemReportButton problemId={problemId} />
      <Toaster />
    </QueryClientProvider>,
  );
}

async function openReportModal() {
  await userEvent.click(screen.getByRole('button', { name: '문제 신고' }));
  return screen.findByRole('dialog', { name: '신고하기' });
}

async function fillReportForm(dialog: HTMLElement, typeLabel: string, reason: string) {
  await userEvent.click(within(dialog).getByRole('radio', { name: typeLabel }));
  await userEvent.type(within(dialog).getByRole('textbox', { name: '신고 사유' }), reason);
}

describe('ProblemReportButton', () => {
  it('누르면 유형 4개가 선택 없이 순서대로 있고 제출하기가 비활성인 작성 모달이 열린다 (AC-2)', async () => {
    renderProblemReportButton();

    const dialog = await openReportModal();

    const radios = within(dialog).getAllByRole('radio');
    expect(radios.map((radio) => radio.closest('label')?.textContent)).toEqual(REPORT_TYPE_LABELS);
    radios.forEach((radio) => expect(radio).not.toBeChecked());
    expect(within(dialog).getByRole('button', { name: '제출하기' })).toBeDisabled();
  });

  it('사유를 입력하면 라벨 "신고 사유"가 보인다 (AC-5)', async () => {
    renderProblemReportButton();
    const dialog = await openReportModal();

    expect(within(dialog).getByPlaceholderText('신고 사유를 입력해주세요.')).toBeInTheDocument();
    expect(within(dialog).queryByText('신고 사유')).not.toBeInTheDocument();

    await userEvent.type(within(dialog).getByRole('textbox'), '오타 있음');

    expect(within(dialog).getByText('신고 사유')).toBeInTheDocument();
  });

  it('제출하면 보던 문제와 입력 그대로를 한 번 보낸다 (AC-6)', async () => {
    const requestBodies = mockReportSubmission();
    renderProblemReportButton(42);
    const dialog = await openReportModal();

    await fillReportForm(dialog, '답안에 오류가 있습니다.', ' 오타 있음 ');
    await userEvent.click(within(dialog).getByRole('button', { name: '제출하기' }));

    await waitFor(() => expect(requestBodies).toHaveLength(1));
    expect(requestBodies[0]).toEqual({
      problemId: 42,
      reportType: 'ANSWER_ERROR',
      content: ' 오타 있음 ',
    });
  });

  it('요청 중이면 제출하기가 로딩 상태이고 다시 눌러도 요청은 한 번이다 (AC-7)', async () => {
    let requestCount = 0;
    server.use(
      http.post(REPORT_URL, async () => {
        requestCount += 1;
        await delay('infinite');
        return new HttpResponse(null);
      }),
    );
    renderProblemReportButton();
    const dialog = await openReportModal();
    await fillReportForm(dialog, '기타', '사유');
    const submitButton = within(dialog).getByRole('button', { name: '제출하기' });

    await userEvent.click(submitButton);
    await waitFor(() => expect(submitButton).toHaveAttribute('aria-busy', 'true'));
    await userEvent.click(submitButton);

    expect(requestCount).toBe(1);
  });

  it('성공하면 작성 모달이 닫히고 성공 모달이 열리며 확인으로 닫힌다 (AC-8)', async () => {
    mockReportSubmission(200);
    renderProblemReportButton();
    const dialog = await openReportModal();
    await fillReportForm(dialog, '기타', '사유');

    await userEvent.click(within(dialog).getByRole('button', { name: '제출하기' }));

    const successDialog = await screen.findByRole('dialog', {
      name: '회원님의 신고가 접수되었어요.',
    });
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(successDialog).toHaveTextContent('회원님의 소중한 의견들을 모아');
    expect(successDialog).toHaveTextContent('더욱 쾌적한 앱 환경을 만들겠습니다.');
    expect(successDialog).toHaveTextContent('단, 허위로 신고할 경우 제재 대상이 될 수 있어요.');

    await userEvent.click(within(successDialog).getByRole('button', { name: '확인' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('실패하면 작성 모달과 입력을 그대로 두고 토스트로 알린다 (AC-9)', async () => {
    mockReportSubmission(500);
    renderProblemReportButton();
    const dialog = await openReportModal();
    await fillReportForm(dialog, '기타', '사유');

    await userEvent.click(within(dialog).getByRole('button', { name: '제출하기' }));

    expect(await screen.findByText('신고에 실패했어요. 다시 시도해 주세요.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: '신고하기' })).toBeInTheDocument();
    expect(within(dialog).getByRole('radio', { name: '기타' })).toBeChecked();
    expect(within(dialog).getByRole('textbox', { name: '신고 사유' })).toHaveValue('사유');
    expect(screen.queryByText('회원님의 신고가 접수되었어요.')).not.toBeInTheDocument();
  });

  it.each([
    ['X', () => userEvent.click(screen.getByRole('button', { name: '닫기' }))],
    ['그만두기', () => userEvent.click(screen.getByRole('button', { name: '그만두기' }))],
    ['Esc', () => userEvent.keyboard('{Escape}')],
  ])('%s 로 닫았다 다시 열면 입력이 비어 있고 요청은 없다 (AC-10)', async (_name, close) => {
    const requestBodies = mockReportSubmission();
    renderProblemReportButton();
    const dialog = await openReportModal();
    await fillReportForm(dialog, '기타', '사유');

    await close();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const reopenedDialog = await openReportModal();

    within(reopenedDialog)
      .getAllByRole('radio')
      .forEach((radio) => expect(radio).not.toBeChecked());
    expect(within(reopenedDialog).getByRole('textbox', { name: '신고 사유' })).toHaveValue('');
    expect(requestBodies).toHaveLength(0);
  });
});
