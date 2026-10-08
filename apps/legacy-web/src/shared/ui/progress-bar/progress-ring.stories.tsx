import type { Meta, StoryObj } from '@storybook/react-vite';

import ProfileIcon from '@/shared/assets/icons/profile3.svg?react';

import ProgressRing from './progress-ring';

const meta: Meta<typeof ProgressRing> = {
  title: 'Shared/UI/Progress/ProgressRing',
  component: ProgressRing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '진행률 퍼센트',
    },
    size: {
      control: 'number',
      description: 'Progress Ring 사이즈',
    },
    children: {
      description: 'Progress Ring 내 요소',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressRing>;

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

export const AsIcon: Story = {
  args: {
    value: 60,
    children: <ProfileIcon />,
  },
};
