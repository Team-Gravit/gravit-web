import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FloatingSelect } from './floating-select';

const OPTIONS = [
  { value: 'BUG_REPORT', label: '버그 신고' },
  { value: 'CONTENT_ERROR', label: '콘텐츠 오류' },
  { value: 'FEATURE_SUGGESTION', label: '기능 제안' },
  { value: 'OTHER', label: '기타' },
];

const meta = {
  title: 'Primitives/FloatingSelect',
  component: FloatingSelect,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    label: '문의유형',
    options: OPTIONS,
    value: '',
    onValueChange: () => {},
    placeholder: '문의 유형을 선택해주세요.',
  },
} satisfies Meta<typeof FloatingSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 선택 전은 placeholder, 선택 후엔 상단에 필드명 라벨이 뜬다. */
export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[420px]">
        <FloatingSelect {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};
