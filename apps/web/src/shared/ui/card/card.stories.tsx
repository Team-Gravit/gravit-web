import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '카드의 패딩·radius·gap 스케일',
      table: { defaultValue: { summary: 'md' } },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-80 shadow-elevation-1',
    children: (
      <>
        <p className="text-headline2 text-text-1">카드 제목</p>
        <p className="text-body2-normal text-text-3">
          표면 컨테이너입니다. elevation 은 사용하는 쪽에서 역할에 맞게 지정합니다(카드 = 1).
        </p>
      </>
    ),
  },
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Card key={size} size={size} className="w-80 shadow-elevation-1">
          <p className="text-headline2 text-text-1">size={size}</p>
        </Card>
      ))}
    </div>
  ),
};
