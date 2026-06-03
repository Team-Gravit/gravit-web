import type { Meta, StoryObj } from '@storybook/react-vite';

import UnitCard from './unit-card';

const meta = {
  title: 'Features/Learning/UnitCard',
  component: UnitCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[156px] md:w-[368px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '챕터 제목',
    },
    lessonNum: {
      control: 'number',
      description: '레슨 번호',
    },
    // status: {
    // 	control: "radio",
    // 	options: ["locked", "unlocked"],
    // 	description: "잠금 여부",
    // 	table: {
    // 		type: { summary: "'locked' | 'unlocked'" },
    // 		defaultValue: { summary: "unlocked" },
    // 	},
    // },
  },
} satisfies Meta<typeof UnitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unlocked: Story = {
  name: '잠금 해제',
  args: {
    title: '변수와 자료형',
    lessonNum: 1,
    chapterId: 1,
  },
};

export const Locked: Story = {
  name: '잠김',
  args: {
    title: '조건문과 반복문',
    lessonNum: 2,
    chapterId: 2,
  },
};

export const LongTitle: Story = {
  name: '긴 제목',
  args: {
    title: '객체 지향 프로그래밍의 핵심 개념 이해하기',
    lessonNum: 10,
    chapterId: 3,
  },
};

export const HighLessonNum: Story = {
  name: '높은 레슨 번호',
  args: {
    title: '심화 알고리즘',
    lessonNum: 99,
    chapterId: 4,
  },
};
