import type { Meta, StoryObj } from '@storybook/react-vite';

import ProfileIcon from '@/shared/assets/icons/profile3.svg?react';

import LabeledProgressRing from './labeled-progress-ring';

const meta: Meta<typeof LabeledProgressRing> = {
  title: 'Shared/UI/Progress/LabeledProgressRing',
  component: LabeledProgressRing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '진행률 퍼센트',
    },
    content: {
      description: 'Progress ring 내부 content',
    },
    label: {
      description: '라벨 텍스트',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        type: {
          summary: "'sm' | 'md' | 'lg'",
        },
      },
      description: '사이즈',
    },
  },
  args: {
    value: 50,
    label: 'LV 5',
  },
};

export default meta;

type Story = StoryObj<typeof LabeledProgressRing>;

export const SizeSmall: Story = {
  name: 'sm',
  args: {
    size: 'sm',
  },
};

export const SizeMedium: Story = {
  name: 'md',
  args: {
    size: 'md',
  },
};

export const SizeLarge: Story = {
  name: 'lg',
  args: {
    size: 'lg',
  },
};

export const AsIcon: Story = {
  args: {
    content: <ProfileIcon />,
    size: 'sm',
  },
};
