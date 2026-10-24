import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './switch';

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '켜짐 여부 (제어형)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화',
    },
    className: {
      control: 'text',
      description: '바깥 여백 등 레이아웃 스타일',
    },
  },
  args: {
    checked: false,
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 클릭하면 상태가 토글됩니다. 치수는 반응형 — 모바일 32×20, 데스크톱(md:) 42×24. */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <Switch {...args} checked={checked} onCheckedChange={setChecked} aria-label="자동 답변" />
    );
  },
};

/** 꺼짐 / 켜짐 두 상태를 비교합니다. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Switch {...args} checked={false} aria-label="꺼짐" />
        <span className="text-xs text-text-3">off</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Switch {...args} checked aria-label="켜짐" />
        <span className="text-xs text-text-3">on</span>
      </div>
    </div>
  ),
};
