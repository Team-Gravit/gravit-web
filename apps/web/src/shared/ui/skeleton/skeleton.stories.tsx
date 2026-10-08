import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './skeleton';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'circular', 'block'],
      description: 'text — 글자 한 줄(높이 1em) · circular — 아바타 · block — 카드·행',
      table: { defaultValue: { summary: 'text' } },
    },
  },
  args: { variant: 'text', className: 'w-40 text-body1-normal' },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 텍스트 스켈레톤은 글자 크기를 따른다. 실데이터와 같은 타이포 클래스를 주면 높이가 맞는다. */
export const Variants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" className="size-8" />
        <Skeleton className="w-24 text-heading2" />
      </div>
      <Skeleton className="w-full text-title3" />
      <Skeleton className="w-2/3 text-body1-normal" />
      <Skeleton variant="block" className="h-14 w-full" />
    </div>
  ),
};
