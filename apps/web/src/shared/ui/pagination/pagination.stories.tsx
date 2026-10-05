import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from './pagination';

const meta = {
  title: 'Primitives/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // 각 스토리는 render로 상태를 직접 재현한다. args는 타입 충족용 기본값이다.
  args: { currentPage: 1, totalPages: 99, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 페이지 상태는 호출부가 소유한다. 여기서는 로컬 상태로 실제 이동을 재현한다. */
function InteractivePagination({
  totalPages,
  initialPage = 1,
}: {
  totalPages: number;
  initialPage?: number;
}) {
  const [page, setPage] = useState(initialPage);
  return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />;
}

/** 페이지가 많아 앞은 펼치고 뒤는 접힌다. 넓은 화면은 주변 페이지를 더 보여준다. */
export const Basic: Story = {
  render: () => <InteractivePagination totalPages={99} />,
};

/** 페이지가 적으면 생략 없이 모두 보여준다. */
export const FewPages: Story = {
  render: () => <InteractivePagination totalPages={5} />,
};

/** 중간 페이지 — 양쪽이 모두 접힌다. */
export const Middle: Story = {
  render: () => <InteractivePagination totalPages={99} initialPage={50} />,
};

/** 마지막 페이지 — 다음 버튼이 비활성이다. */
export const LastPage: Story = {
  render: () => <InteractivePagination totalPages={99} initialPage={99} />,
};
