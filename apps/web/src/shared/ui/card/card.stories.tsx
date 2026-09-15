import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './card';
import { CardHeader, CardTitle } from './card-header';
import { CardRetryStatus, CardStatus } from './card-status';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { className: 'w-92' },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 헤더(제목 + 우측 액션)와 본문. 우측 링크는 `CardLink` — 라우터가 필요해 여기서는 생략한다. */
export const Basic: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>연속 학습일</CardTitle>
      </CardHeader>
      <p className="text-body1-normal text-text-1">본문</p>
    </Card>
  ),
};

/** 요청 실패. 헤더는 그대로 두고 본문만 「다시 시도」로 바뀐다. 조사(을/를)는 자동이다. */
export const Failed: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>이어서 학습하기</CardTitle>
      </CardHeader>
      <CardRetryStatus sectionName="이어서 학습하기" onRetry={() => {}} />
    </Card>
  ),
};

/** 데이터 없음. 조용한 `role="status"`. */
export const Empty: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>연속 학습일</CardTitle>
      </CardHeader>
      <CardStatus message="아직 학습 기록이 없어요." />
    </Card>
  ),
};
