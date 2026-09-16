import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from './breadcrumb';

// 내부 `Link`를 렌더링하려면 라우터 컨텍스트가 필요합니다.
// 스토리에서는 실제 앱 라우터 대신 최소 메모리 라우터를 사용합니다.
const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({ component: Story });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  return <RouterProvider router={router} />;
};

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '현재 위치와 상위 경로를 보여주고, 이전 단계로 이동할 수 있도록 돕습니다. 마지막 항목은 현재 위치이므로 링크로 제공하지 않습니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items: [
      { label: '홈', link: { to: '/main' } },
      { label: '자료구조', link: { to: '/learning' } },
      { label: 'Unit01' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * 한 단계부터 세 단계까지의 경로를 비교할 수 있습니다. 마지막 항목은 현재 위치를 나타내며,
 * 링크 대신 `aria-current="page"`를 가진 텍스트로 표시합니다.
 */
export const Depth: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Breadcrumb items={[{ label: '자료구조' }]} />
      <Breadcrumb items={[{ label: '홈', link: { to: '/main' } }, { label: '자료구조' }]} />
      <Breadcrumb
        items={[
          { label: '홈', link: { to: '/main' } },
          { label: '자료구조', link: { to: '/learning' } },
          { label: 'Unit01' },
        ]}
      />
    </div>
  ),
};

/** 긴 챕터명과 유닛명도 줄바꿈 없이 한 줄로 표시되는 상태를 확인할 수 있습니다. */
export const LongLabel: Story = {
  args: {
    items: [
      { label: '홈', link: { to: '/main' } },
      { label: '운영체제와 시스템 프로그래밍', link: { to: '/learning' } },
      { label: 'Unit07 - 가상 메모리와 페이지 교체 알고리즘' },
    ],
  },
};
