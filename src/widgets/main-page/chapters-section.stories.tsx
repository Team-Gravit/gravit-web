import type { Meta, StoryObj } from '@storybook/react-vite';

import type { RecommendedUnit } from '@/entities/learning/model/schema';

import ChaptersSection from './recommended-units-section';

const meta = {
  title: 'Widgets/MainPage/ChaptersSection',
  component: ChaptersSection,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[720px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    units: { table: { disable: true } },
  },
} satisfies Meta<typeof ChaptersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUnits: RecommendedUnit[] = [
  { unitId: 1, unitTitle: '변수와 자료형', chapterId: 1, chapterTitle: '프로그래밍 기초' },
  { unitId: 2, unitTitle: '조건문과 반복문', chapterId: 1, chapterTitle: '프로그래밍 기초' },
  { unitId: 3, unitTitle: '함수와 스코프', chapterId: 2, chapterTitle: '함수형 프로그래밍' },
  { unitId: 4, unitTitle: '객체와 배열', chapterId: 2, chapterTitle: '함수형 프로그래밍' },
];

export const Default: Story = {
  name: '기본',
  args: { units: mockUnits },
};

export const SingleUnit: Story = {
  name: '유닛 1개',
  args: { units: [mockUnits[0]] },
};

export const ManyUnits: Story = {
  name: '유닛 4개',
  args: { units: mockUnits },
};
