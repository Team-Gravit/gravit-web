import type { Meta, StoryObj } from '@storybook/react-vite';

import { InfoTooltip } from './info-tooltip';

const meta = {
  title: 'Primitives/InfoTooltip',
  component: InfoTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '터치는 탭으로, 마우스는 올리거나 클릭해서 연다. 클릭으로 연 말풍선은 바깥 클릭이나 Esc 로 닫힌다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    content: '데이터를 효율적으로 저장하고 꺼내는 방법을 배워요.',
    label: '자료구조 설명 보기',
    className: 'size-6 text-text-1',
  },
} satisfies Meta<typeof InfoTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    content:
      '운영체제가 프로세스와 메모리를 어떻게 관리하는지, 스케줄링과 동기화가 왜 필요한지 차근차근 배워요.',
  },
};
