import type { Meta, StoryObj } from '@storybook/react-vite';

import { ICONS } from '@/shared/ui/icon';

import { IconButton } from './icon-button';

const ICON_BUTTON_VARIANTS = [
  'default',
  'secondary',
  'stroke-default',
  'stroke-secondary',
  'ghost',
] as const;
const ICON_BUTTON_SHAPES = ['rounded', 'circle'] as const;

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(ICONS),
      description: '버튼에 표시할 아이콘',
    },
    variant: {
      control: 'inline-radio',
      options: ICON_BUTTON_VARIANTS,
      description: '버튼의 시각 스타일',
      table: { defaultValue: { summary: 'ghost' } },
    },
    shape: {
      control: 'inline-radio',
      options: ICON_BUTTON_SHAPES,
      description: '아이콘 버튼의 모양 (rounded: 6px, circle: 원형)',
      table: { defaultValue: { summary: 'rounded' } },
    },
    iconSize: {
      control: { type: 'range', min: 16, max: 32, step: 4 },
      description: '아이콘의 너비와 높이(px)',
      table: { defaultValue: { summary: '24' } },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    'aria-label': {
      control: 'text',
      description: '아이콘 버튼의 접근 가능한 이름. 타입에서 필수입니다.',
    },
  },
  args: {
    icon: 'plus',
    variant: 'ghost',
    shape: 'rounded',
    iconSize: 24,
    disabled: false,
    'aria-label': '추가',
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 아이콘, 스타일, 모양과 비활성 상태를 컨트롤로 조작합니다. */
export const Playground: Story = {};

/** 동일한 아이콘으로 제공되는 시각 스타일을 비교합니다. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {ICON_BUTTON_VARIANTS.map((variant) => (
        <IconButton {...args} key={variant} variant={variant} aria-label={`${variant} 추가`} />
      ))}
    </div>
  ),
};

/** 기본 6px rounded 모양과 원형 버튼을 비교합니다. */
export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {ICON_BUTTON_SHAPES.map((shape) => (
        <IconButton {...args} key={shape} shape={shape} aria-label={`${shape} 추가`} />
      ))}
    </div>
  ),
};

/** variant 마다 서로 다른 비활성 스타일을 비교합니다. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {ICON_BUTTON_VARIANTS.map((variant) => (
        <IconButton
          {...args}
          key={variant}
          disabled
          variant={variant}
          aria-label={`${variant} 비활성 추가`}
        />
      ))}
    </div>
  ),
};

/**
 * 아이콘 버튼은 보이는 텍스트가 없으므로 접근 가능한 이름이 반드시 필요합니다.
 * `aria-label` 은 타입에서 필수라 빠뜨리면 컴파일되지 않습니다.
 */
export const AccessibleName: Story = {
  args: { icon: 'search', 'aria-label': '검색' },
};
