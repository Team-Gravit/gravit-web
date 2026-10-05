import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FloatingTextArea } from './floating-textarea';
import { FloatingTextField } from './floating-text-field';
import { TextField } from './text-field';

const meta = {
  title: 'Primitives/TextField',
  component: TextField,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 한 줄 입력. `tone`으로 상태 색을 바꾼다. */
export const Default: Story = {
  args: { placeholder: '입력하세요' },
};

export const Error: Story = {
  args: { placeholder: '입력하세요', tone: 'error', defaultValue: '잘못된 값' },
};

/** floating label 라인 필드. 값이 있으면 상단에 필드명이 뜬다. */
export const Floating: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Floating TextField');
    return (
      <FloatingTextField
        label="label"
        placeholder="제목을 입력해주세요."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-[420px]"
      />
    );
  },
};

/** floating label 여러 줄 필드. */
export const FloatingArea: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Floating TextArea');
    return (
      <FloatingTextArea
        label="label"
        placeholder="문의 내용을 입력해주세요."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-[200px] w-[420px]"
      />
    );
  },
};
