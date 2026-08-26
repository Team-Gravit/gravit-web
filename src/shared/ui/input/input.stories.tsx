import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Input from './input';

const meta = {
  title: 'Components/Input/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    id: 'input',
    label: '제목',
    placeholder: '제목을 입력하세요',
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledInput(props: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState(props.value ?? '');
  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export const Default: Story = {
  name: '기본 (빈 상태)',
  render: (args) => <ControlledInput {...args} />,
};

export const WithValue: Story = {
  name: '값 입력됨 (라벨 표시)',
  render: (args) => <ControlledInput {...args} value="텍스트" />,
};

export const Disabled: Story = {
  name: '비활성화',
  render: (args) => <ControlledInput {...args} value="수정 불가 텍스트" disabled />,
};

export const AllStates: Story = {
  name: '상태별',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <ControlledInput id="empty" label="제목" placeholder="제목을 입력하세요" />
      <ControlledInput id="filled" label="제목" placeholder="제목을 입력하세요" value="텍스트" />
      <ControlledInput
        id="disabled"
        label="제목"
        placeholder="제목을 입력하세요"
        value="수정 불가 텍스트"
        disabled
      />
    </div>
  ),
};
