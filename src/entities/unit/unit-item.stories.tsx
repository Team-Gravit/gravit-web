import type { Meta, StoryObj } from '@storybook/react-vite';

import UnitItem from './unit-item';

const meta = {
  component: UnitItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    unitId: 1,
    unitTitle: '변수와 자료형',
    unitStatus: 'notStarted',
  },
} satisfies Meta<typeof UnitItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const fixedWidth = [
  (Story: React.ComponentType) => (
    <div className="w-[480px]">
      <Story />
    </div>
  ),
];

export const NotStarted: Story = {
  name: '잠김',
  decorators: fixedWidth,
};

export const InProgress: Story = {
  name: '진행 중',
  args: { unitStatus: 'inProgress' },
  decorators: fixedWidth,
};

export const Completed: Story = {
  name: '완료',
  args: { unitStatus: 'completed' },
  decorators: fixedWidth,
};

export const LongTitle: Story = {
  name: '긴 제목',
  args: {
    unitStatus: 'inProgress',
    unitTitle: '함수형 프로그래밍의 핵심 개념과 실전 활용 방법 이해하기',
  },
  decorators: fixedWidth,
};

export const OnMobile: Story = {
  name: '모바일 (375px)',
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'iphone6' },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export const OnDesktop: Story = {
  name: '데스크탑 (768px)',
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'ipad' },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};
