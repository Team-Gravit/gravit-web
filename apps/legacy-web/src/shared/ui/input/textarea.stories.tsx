import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import TextArea from './textarea';

const meta = {
  title: 'Components/Input/TextArea',
  component: TextArea,
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
    id: 'textarea',
    label: '내용',
    placeholder: '내용을 입력하세요',
    disabled: false,
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledTextarea(props: React.ComponentProps<typeof TextArea>) {
  const [value, setValue] = useState(props.value ?? '');
  return <TextArea {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export const Default: Story = {
  name: '기본 (빈 상태)',
  render: (args) => <ControlledTextarea {...args} />,
};

export const WithValue: Story = {
  name: '값 입력됨 (라벨 표시)',
  render: (args) => <ControlledTextarea {...args} value="텍스트" />,
};

export const Disabled: Story = {
  name: '비활성화',
  render: (args) => <ControlledTextarea {...args} value="수정 불가 텍스트입니다." disabled />,
};

export const AllStates: Story = {
  name: '상태별',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <ControlledTextarea id="empty" label="내용" placeholder="내용을 입력하세요" />
      <ControlledTextarea id="filled" label="내용" placeholder="내용을 입력하세요" value="텍스트" />
      <ControlledTextarea
        id="disabled"
        label="내용"
        placeholder="내용을 입력하세요"
        value="수정 불가 텍스트입니다."
        disabled
      />
    </div>
  ),
};
