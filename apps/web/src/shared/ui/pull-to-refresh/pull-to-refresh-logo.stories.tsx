import type { Meta, StoryObj } from '@storybook/react-vite';

import { PullToRefreshLogo } from './pull-to-refresh-logo';

const meta = {
  title: 'Primitives/PullToRefreshLogo',
  component: PullToRefreshLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    drawProgress: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: '몸통을 그린 비율. 당긴 거리 ÷ 임계 거리',
    },
    isReadyToRefresh: {
      control: 'boolean',
      description: '눈 표시. 놓으면 새로고침되는 거리부터 켜집니다.',
    },
    isRefreshing: {
      control: 'boolean',
      description: '새로고침 중 통통 튀기. 모션 감소 환경에서는 깜빡입니다.',
    },
  },
  args: {
    drawProgress: 0.5,
    isReadyToRefresh: false,
    isRefreshing: false,
  },
} satisfies Meta<typeof PullToRefreshLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 당기는 동안 몸통이 그려진다. */
export const Pulling: Story = {};

/** 놓으면 새로고침이 시작되는 거리에서 눈이 나타난다. */
export const CanRelease: Story = {
  args: { drawProgress: 1, isReadyToRefresh: true },
};

/** 새로고침 중에는 완성된 로고가 튄다. */
export const Refreshing: Story = {
  args: { drawProgress: 1, isReadyToRefresh: true, isRefreshing: true },
};
