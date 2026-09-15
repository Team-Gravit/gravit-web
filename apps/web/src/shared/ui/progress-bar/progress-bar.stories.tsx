import type { Meta, StoryObj } from '@storybook/react-vite';

import { LabeledProgressBar } from './labeled-progress-bar';
import { ProgressBar } from './progress-bar';

const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: '0~100. 범위 밖은 잘라낸다',
    },
  },
  args: { value: 31, 'aria-label': '경험치', className: 'w-80' },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 라벨과 퍼센트가 붙은 형태. 챕터 진행률(굵은 제목)과 「진행률」(보조 라벨) 두 쓰임. */
export const Labeled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <LabeledProgressBar label="자료구조" value={10} />
      <LabeledProgressBar
        label="진행률"
        value={50}
        labelClassName="text-label2 text-text-4 md:text-body1-normal md:text-text-4"
      />
    </div>
  ),
};

/** 0% · 100% · 범위 밖(150 → 100) */
export const Edges: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <ProgressBar value={0} aria-label="0" />
      <ProgressBar value={100} aria-label="100" />
      <ProgressBar value={150} aria-label="150" />
    </div>
  ),
};
