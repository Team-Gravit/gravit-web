import { beforeEach, describe, expect, it } from 'vitest';
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useParams,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';

import { canEnterSessionSetupStep, resetSessionSetup } from '@/features/interview-session-setup';
// 초안을 채우고 확인하려면 store 가 필요하다. 공개 API 로 노출하지 않으므로 테스트에서만 내부 경로를 쓴다.
import { useSessionSetupStore } from '@/features/interview-session-setup/model/session-setup-store';

import {
  getSessionSetupEntryHistoryIndex,
  guardSessionSetupStep,
  leaveSessionSetup,
  recordSessionSetupEntry,
} from './-interview-setup-route';

function StepScreen() {
  const { step = '' } = useParams({ strict: false });
  return <p>단계 {step}</p>;
}

async function renderAt(initialEntries: string[]) {
  const rootRoute = createRootRoute();
  const setupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/interview/new',
    beforeLoad: recordSessionSetupEntry,
    component: Outlet,
    onLeave: leaveSessionSetup,
  });
  const stepRoute = createRoute({
    getParentRoute: () => setupRoute,
    path: '$step',
    beforeLoad: guardSessionSetupStep,
    component: StepScreen,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/interview',
        component: () => <p>AI면접 홈</p>,
      }),
      setupRoute.addChildren([stepRoute]),
    ]),
    history: createMemoryHistory({ initialEntries, initialIndex: initialEntries.length - 1 }),
  });

  await router.load();
  render(<RouterProvider router={router as never} />);
  return router;
}

function fillAnswerTypeAndMode() {
  const state = useSessionSetupStore.getState();
  state.selectInputType('VOICE');
  state.selectMode('COMMON_CS');
}

beforeEach(() => {
  resetSessionSetup();
});

describe('/interview/new 초안 수명', () => {
  it('단계 사이를 오가면 선택이 유지된다', async () => {
    fillAnswerTypeAndMode();
    const router = await renderAt(['/interview/new/topic']);

    await router.navigate({ to: '/interview/new/$step', params: { step: 'answer-type' } });

    expect(await screen.findByText('단계 answer-type')).toBeInTheDocument();
    expect(useSessionSetupStore.getState().inputType).toBe('VOICE');
  });

  it('흐름 밖으로 이동하면 선택이 비워진다', async () => {
    fillAnswerTypeAndMode();
    const router = await renderAt(['/interview/new/topic']);

    await router.navigate({ to: '/interview' });

    expect(await screen.findByText('AI면접 홈')).toBeInTheDocument();
    expect(useSessionSetupStore.getState().inputType).toBeNull();
  });

  it('브라우저 뒤로가기로 나가도 선택이 비워진다', async () => {
    fillAnswerTypeAndMode();
    const router = await renderAt(['/interview', '/interview/new/topic']);
    await screen.findByText('단계 topic');

    router.history.back();

    expect(await screen.findByText('AI면접 홈')).toBeInTheDocument();
    await waitFor(() => expect(useSessionSetupStore.getState().inputType).toBeNull());
  });
});

describe('/interview/new/$step 진입 가드 (AC-12)', () => {
  it('선택 없이 중간 단계로 들어오면 answer-type 으로 보낸다', async () => {
    const router = await renderAt(['/interview/new/difficulty']);

    expect(await screen.findByText('단계 answer-type')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/interview/new/answer-type');
  });

  it('앞 단계 선택을 마쳤으면 그 단계로 들어간다', async () => {
    fillAnswerTypeAndMode();

    expect(canEnterSessionSetupStep('cs-topics')).toBe(true);
    await renderAt(['/interview/new/cs-topics']);

    expect(await screen.findByText('단계 cs-topics')).toBeInTheDocument();
  });
});

describe('/interview/new 진입 기록 위치', () => {
  it('설정에 들어온 위치를 남기고, 단계를 넘겨도 그 위치를 유지한다', async () => {
    fillAnswerTypeAndMode();
    const router = await renderAt(['/interview']);

    await router.navigate({ to: '/interview/new/$step', params: { step: 'answer-type' } });
    const entryIndex = router.history.location.state.__TSR_index;
    await router.navigate({ to: '/interview/new/$step', params: { step: 'topic' } });

    expect(router.history.location.state.__TSR_index).toBe(entryIndex + 1);
    expect(getSessionSetupEntryHistoryIndex()).toBe(entryIndex);
  });
});
