import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import { AudioPlayerProvider } from '@/shared/ui/audio-player';
import { Toaster } from '@/shared/ui/toast';

import type { SessionSetupStep } from '../model/session-setup-rules';
import { useSessionSetupStore } from '../model/session-setup-store';
import { SessionSetup } from './session-setup';

const CREATE_URL = '*/api/v1/interview-sessions';
const AOS_STACKS_URL = '*/api/v1/interview-stack-groups/AOS/stacks';
const CS_TOPICS_URL = '*/api/v1/interview-topics';

interface RenderOptions {
  step: SessionSetupStep;
  onCreated?: (sessionId: number) => Promise<void>;
}

function renderSessionSetup({ step, onCreated = vi.fn(async () => {}) }: RenderOptions) {
  function SessionSetupHarness() {
    return (
      <AudioPlayerProvider>
        <SessionSetup
          step={step}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
          onExit={vi.fn(async () => {})}
          onCreated={onCreated}
        />
        <Toaster />
      </AudioPlayerProvider>
    );
  }
  return renderWithProviders(SessionSetupHarness);
}

function fillCsDraft() {
  const state = useSessionSetupStore.getState();
  state.selectInputType('TEXT');
  state.selectMode('COMMON_CS');
  state.toggleTopic('ALGORITHM');
  state.selectDifficulty('NORMAL');
}

beforeEach(() => {
  useSessionSetupStore.getState().reset();
  server.use(
    http.get(CS_TOPICS_URL, () =>
      HttpResponse.json([{ topic: 'ALGORITHM', displayName: '알고리즘' }]),
    ),
  );
});

describe('SessionSetup', () => {
  it('난이도 카드에서 하나를 선택하거나 방향키로 바꾸고, 다시 누르면 해제한다', async () => {
    const state = useSessionSetupStore.getState();
    state.selectInputType('TEXT');
    state.selectMode('COMMON_CS');
    state.toggleTopic('ALGORITHM');
    await renderSessionSetup({ step: 'difficulty' });
    const user = userEvent.setup();
    const hard = screen.getByRole('radio', { name: /심화 개념까지/ });
    const normal = screen.getByRole('radio', { name: /기본과 심화 개념/ });
    const next = screen.getByRole('button', { name: '다음' });

    expect(next).toBeDisabled();
    await user.click(screen.getByText('심화 개념까지 깊이 있게 물어봐요'));
    expect(hard).toBeChecked();
    expect(next).toBeEnabled();

    hard.focus();
    await user.keyboard('{ArrowDown}');
    expect(normal).toBeChecked();
    expect(hard).not.toBeChecked();
    expect(useSessionSetupStore.getState().difficulty).toBe('NORMAL');

    await user.click(screen.getByText('기본과 심화 개념을 골고루 물어봐요'));
    expect(normal).not.toBeChecked();
    expect(next).toBeDisabled();
  });

  it('CS 확인 화면은 선택한 분야의 표시명과 텍스트 면접 안내를 보여준다', async () => {
    fillCsDraft();
    await renderSessionSetup({ step: 'confirm' });
    const summary = within(screen.getByRole('region', { name: '선택 항목' }));

    expect(summary.getByText('텍스트 면접')).toBeInTheDocument();
    expect(await summary.findByText('알고리즘')).toBeInTheDocument();
    expect(summary.queryByText('직군')).not.toBeInTheDocument();
    expect(screen.getByText('답변은 최대 1,000자까지 작성할 수 있어요')).toBeInTheDocument();
  });

  it('직군을 고르면 다음 단계로 넘어가기 전에 그 직군의 스택 목록을 요청한다', async () => {
    const requestStacks = vi.fn();
    server.use(
      http.get(AOS_STACKS_URL, () => {
        requestStacks();
        return HttpResponse.json([{ stack: 'KOTLIN_COMPOSE', displayName: 'Kotlin + Compose' }]);
      }),
    );
    const user = userEvent.setup();
    const state = useSessionSetupStore.getState();
    state.selectInputType('VOICE');
    state.selectMode('JOB_SPECIFIC');
    await renderSessionSetup({ step: 'job' });

    await user.click(screen.getByRole('radio', { name: /안드로이드/ }));

    await waitFor(() => expect(requestStacks).toHaveBeenCalledTimes(1));
  });

  it('직군별 확인 화면은 선택한 직군·스택의 표시명과 음성 면접 안내를 보여준다', async () => {
    server.use(
      http.get(AOS_STACKS_URL, () =>
        HttpResponse.json([{ stack: 'KOTLIN_COMPOSE', displayName: 'Kotlin + Compose' }]),
      ),
    );
    const state = useSessionSetupStore.getState();
    state.selectInputType('VOICE');
    state.selectMode('JOB_SPECIFIC');
    state.selectStackGroup('AOS');
    state.selectStack('KOTLIN_COMPOSE');
    state.selectDifficulty('HARD');
    await renderSessionSetup({ step: 'confirm' });
    const summary = within(screen.getByRole('region', { name: '선택 항목' }));

    expect(summary.getByText('음성 면접')).toBeInTheDocument();
    expect(summary.getByText('안드로이드')).toBeInTheDocument();
    expect(await summary.findByText('Kotlin + Compose')).toBeInTheDocument();
    expect(summary.queryByText('주제')).not.toBeInTheDocument();
    expect(screen.getByText('답변은 재녹음 없이 한 번만 녹음돼요')).toBeInTheDocument();
  });

  it('CS 분야의 전체 선택과 개별 해제를 체크박스에 반영하고 스페이스로 선택할 수 있다', async () => {
    server.use(
      http.get(CS_TOPICS_URL, () =>
        HttpResponse.json([
          { topic: 'ALGORITHM', displayName: '알고리즘' },
          { topic: 'NETWORK', displayName: '네트워크' },
        ]),
      ),
    );
    const state = useSessionSetupStore.getState();
    state.selectInputType('TEXT');
    state.selectMode('COMMON_CS');
    await renderSessionSetup({ step: 'cs-topics' });
    const user = userEvent.setup();
    const selectAll = await screen.findByRole('checkbox', { name: '전체 선택' });
    const algorithm = screen.getByRole('checkbox', { name: '알고리즘' });
    const network = screen.getByRole('checkbox', { name: '네트워크' });

    await user.click(selectAll);
    expect(algorithm).toBeChecked();
    expect(network).toBeChecked();

    await user.click(screen.getByText('알고리즘'));
    expect(algorithm).not.toBeChecked();
    expect(selectAll).not.toBeChecked();

    algorithm.focus();
    await user.keyboard(' ');
    expect(algorithm).toBeChecked();
    expect(selectAll).toBeChecked();

    await user.click(selectAll);
    expect(useSessionSetupStore.getState().topics).toEqual([]);
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('스택이 하나뿐인 직군이면 그 스택이 선택된 채로 다음이 활성화된다 (AC-5)', async () => {
    server.use(
      http.get(AOS_STACKS_URL, () =>
        HttpResponse.json([{ stack: 'KOTLIN_COMPOSE', displayName: 'Kotlin + Compose' }]),
      ),
    );
    const state = useSessionSetupStore.getState();
    state.selectInputType('VOICE');
    state.selectMode('JOB_SPECIFIC');
    state.selectStackGroup('AOS');

    await renderSessionSetup({ step: 'stack' });

    expect(await screen.findByRole('radio', { name: 'Kotlin + Compose' })).toBeChecked();
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
    expect(useSessionSetupStore.getState().stack).toBe('KOTLIN_COMPOSE');
  });

  it('선택된 답변 방식을 다시 누르면 해제되고 다음이 비활성화된다 (AC-1)', async () => {
    await renderSessionSetup({ step: 'answer-type' });
    const user = userEvent.setup();
    const voiceRadio = await screen.findByRole('radio', { name: /음성 모드/ });

    await user.click(voiceRadio);
    expect(voiceRadio).toBeChecked();
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();

    await user.click(voiceRadio);
    expect(voiceRadio).not.toBeChecked();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('방향키로 다른 답변 방식을 고를 수 있다', async () => {
    await renderSessionSetup({ step: 'answer-type' });
    const user = userEvent.setup();

    await user.click(await screen.findByRole('radio', { name: /음성 모드/ }));
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('radio', { name: /텍스트 모드/ })).toBeChecked();
    expect(useSessionSetupStore.getState().inputType).toBe('TEXT');
  });

  it('「시작하기」를 연달아 눌러도 생성 요청은 한 번이고, 생성된 sessionId 를 넘긴다 (AC-10)', async () => {
    const requestBodies: unknown[] = [];
    server.use(
      http.post(CREATE_URL, async ({ request }) => {
        requestBodies.push(await request.json());
        return HttpResponse.json({ sessionId: 12 }, { status: 201 });
      }),
    );
    // 실제 앱처럼 생성 뒤 이동이 진행 중인 상태를 끝나지 않는 Promise 로 재현한다.
    const onCreated = vi.fn(() => new Promise<void>(() => {}));
    fillCsDraft();
    await renderSessionSetup({ step: 'confirm', onCreated });

    const startButton = await screen.findByRole('button', { name: '시작하기' });
    const user = userEvent.setup();
    await user.click(startButton);
    await user.click(startButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(12));
    expect(requestBodies).toEqual([
      { inputType: 'TEXT', mode: 'COMMON_CS', difficulty: 'NORMAL', topics: ['ALGORITHM'] },
    ]);
  });

  it('생성이 409 로 실패하면 서버 문구를 토스트로 띄우고 초안을 유지한다 (AC-11)', async () => {
    server.use(
      http.post(CREATE_URL, () =>
        HttpResponse.json(
          {
            error: 'INTERVIEW_4009',
            message: '면접 질문 풀이 부족하여 세션을 생성할 수 없습니다.',
          },
          { status: 409 },
        ),
      ),
    );
    const onCreated = vi.fn(async () => {});
    fillCsDraft();
    await renderSessionSetup({ step: 'confirm', onCreated });

    await userEvent.click(await screen.findByRole('button', { name: '시작하기' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      '면접 질문 풀이 부족하여 세션을 생성할 수 없습니다.',
    );
    expect(onCreated).not.toHaveBeenCalled();
    expect(useSessionSetupStore.getState().topics).toEqual(['ALGORITHM']);
  });
});
