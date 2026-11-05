import type { Meta, StoryObj } from '@storybook/react-vite';

import { Chip } from './chip';

const CHIP_VARIANTS = ['filled', 'outlined', 'muted'] as const;
const CHIP_SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: CHIP_VARIANTS,
      description: 'filled — 진행 중 · outlined — 완료 · muted — 잠김 (Figma chip · chip/nav)',
      table: { defaultValue: { summary: 'filled' } },
    },
    size: {
      control: 'inline-radio',
      options: CHIP_SIZES,
      description: '고정 크기. 기본값은 모바일 sm·데스크톱 lg 반응형 조합',
      table: { defaultValue: { summary: "{ base: 'sm', md: 'lg' }" } },
    },
  },
  args: { variant: 'filled', children: '학습 중' },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 고정 크기 세 단계를 비교한다. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {CHIP_SIZES.map((size) => (
        <Chip key={size} size={size}>
          {size}
        </Chip>
      ))}
    </div>
  ),
};

/** 유닛 상태 3종. 기본 크기는 768px 미만 `sm`, 이상 `lg`다. */
export const UnitStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Chip variant="outlined">학습 완료</Chip>
      <Chip variant="filled">학습 중</Chip>
      <Chip variant="muted">잠김</Chip>
    </div>
  ),
};
