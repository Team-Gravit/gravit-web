import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';

import { QuizQuitModal } from './quiz-quit-modal';

// 그만두기 링크를 렌더링할 수 있도록 스토리에 메모리 라우터를 붙인다.
const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({ component: Story });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  return <RouterProvider router={router} />;
};

const meta = {
  title: 'Widgets/QuizQuitModal',
  component: QuizQuitModal,
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '레슨 풀이 상단바의 닫기를 누르면 떠나기 전에 묻습니다. 시안: Figma `APP-UP-그만두기 모달` · `WEB-UP-그만두기 모달`.',
      },
    },
  },
  args: {
    open: true,
    onOpenChange: () => {},
    unitId: 3,
    chapterTitle: '자료구조',
  },
} satisfies Meta<typeof QuizQuitModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 챕터명을 받기 전이나 조회에 실패했을 때의 문구. */
export const WithoutChapterTitle: Story = {
  args: { chapterTitle: undefined },
};
