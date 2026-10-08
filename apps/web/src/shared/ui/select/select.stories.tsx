import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from './select';

const YEAR_OPTIONS = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
];

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledSelect() {
  const [value, setValue] = useState('2026');
  return (
    <Select options={YEAR_OPTIONS} value={value} onValueChange={setValue} aria-label="연도 선택" />
  );
}

export const Default: Story = {
  args: {
    options: YEAR_OPTIONS,
    value: '2026',
    onValueChange: () => {},
  },
  render: () => <ControlledSelect />,
};

export const Disabled: Story = {
  args: {
    options: YEAR_OPTIONS,
    value: '2026',
    onValueChange: () => {},
    disabled: true,
  },
};
