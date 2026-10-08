import type { Meta, StoryObj } from '@storybook/react-vite';

import ProgressBar from './progress-bar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Shared/UI/Progress/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '진행률 퍼센트',
    },
    className: {
      description: '프로그래스 바 래퍼 요소 클래스',
    },
    barClassName: {
      description: '프로그래스 바 요소 클래스',
    },
  },
  args: {
    value: 50,
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const Fill: Story = {
  args: {
    value: 100,
  },
};
