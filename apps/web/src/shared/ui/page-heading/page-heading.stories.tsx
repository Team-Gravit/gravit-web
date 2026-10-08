import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';

import { PageHeading } from './page-heading';

// Breadcrumb 내부 `Link`를 렌더링하려면 라우터 컨텍스트가 필요합니다.
// 스토리에서는 실제 앱 라우터 대신 최소 메모리 라우터를 사용합니다.
const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({ component: Story });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  return <RouterProvider router={router} />;
};

const CHAPTER_DESCRIPTION =
  '배열, 연결리스트, 스택 등 기본적인 자료구조의 개념과 구현을 학습하는 챕터입니다.';

const meta = {
  title: 'Primitives/PageHeading',
  component: PageHeading,
  decorators: [withRouter],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '상세 화면의 제목과 설명을 보여줍니다. 넓은 화면에서는 상위 경로를 함께 표시하고, 좁은 화면에서는 제목과 설명만 사용할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: '자료구조',
    description: CHAPTER_DESCRIPTION,
    breadcrumbItems: [{ label: '홈', link: { to: '/main' } }, { label: '자료구조' }],
  },
} satisfies Meta<typeof PageHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 제목과 설명의 크기는 `md`(768px)를 기준으로 달라집니다. Storybook 툴바에서 뷰포트를
 * 변경하면 넓은 화면과 좁은 화면의 타이포그래피를 비교할 수 있습니다.
 */
export const Playground: Story = {};

/**
 * 좁은 화면처럼 경로 없이 제목과 설명만 보여주는 상태입니다. 페이지에서 화면 폭을 분기할 때는
 * 넓은 화면에만 `breadcrumbItems`를 전달합니다.
 */
export const WithoutBreadcrumb: Story = {
  args: { breadcrumbItems: undefined },
};

/** 설명을 제공하지 않으면 제목만 표시되며 불필요한 아래 여백이 생기지 않습니다. */
export const TitleOnly: Story = {
  args: { description: undefined, breadcrumbItems: undefined },
};

/** 유닛 상세 화면처럼 세 단계 경로를 사용하는 예시입니다. */
export const UnitDepth: Story = {
  args: {
    title: 'Unit01',
    description: '배열과 연결 리스트를 활용해 데이터를 효율적으로 관리하는 방법을 학습합니다.',
    breadcrumbItems: [
      { label: '홈', link: { to: '/main' } },
      { label: '자료구조', link: { to: '/learning' } },
      { label: 'Unit01' },
    ],
  },
};
