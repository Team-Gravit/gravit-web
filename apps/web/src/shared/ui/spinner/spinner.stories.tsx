import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './spinner';

const SPINNER_SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: SPINNER_SIZES,
      description: '회전 링의 크기',
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: '스크린 리더가 안내할 로딩 상태 이름. null 이면 안내하지 않습니다.',
      table: { defaultValue: { summary: '불러오는 중' } },
    },
    className: {
      control: 'text',
      description: '크기, 색, 여백 등 바깥 스타일',
    },
  },
  args: {
    size: 'md',
    label: '불러오는 중',
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 크기와 안내 문구를 컨트롤로 조작합니다. */
export const Playground: Story = {};

/** 제공되는 세 가지 크기를 비교합니다. 테두리 두께도 크기에 맞춰 함께 조정됩니다. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-8">
      {SPINNER_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner {...args} size={size} label={`${size} 불러오는 중`} />
          <span className="text-xs text-text-3">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * 링 색은 `currentColor` 를 따릅니다.
 * 부모의 글자색만 바꾸면 스피너가 따라오므로 variant 별로 색을 따로 지정할 필요가 없습니다.
 */
export const InheritsColor: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center gap-2 rounded-12 bg-bg-2 p-6 text-text-1">
        <Spinner {...args} label="기본 글자색" />
        <span className="text-xs text-text-3">text-text-1</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-12 bg-cta p-6 text-cta-text">
        <Spinner {...args} label="CTA 위" />
        <span className="text-xs text-cta-text">text-cta-text</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-12 bg-bg-2 p-6 text-main">
        <Spinner {...args} label="브랜드 색" />
        <span className="text-xs text-text-3">text-main</span>
      </div>
    </div>
  ),
};

/**
 * 버튼 안에서 쓰는 방식입니다.
 *
 * - 버튼이 `aria-busy` 로 로딩을 알리므로 스피너는 `label={null}` 로 중복 안내를 막습니다.
 * - 레이블을 `invisible` 로 남겨 폭을 유지하고 스피너를 겹쳐 올려, 로딩 전환 시 버튼 크기가 변하지 않습니다.
 */
export const InButton: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="rounded-12 bg-cta px-5 py-3 text-cta-text"
      >
        저장하기
      </button>
      <button
        type="button"
        aria-busy="true"
        disabled
        className="relative rounded-12 bg-cta px-5 py-3 text-cta-text disabled:opacity-70"
      >
        <span className="invisible">저장하기</span>
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size="sm" label={null} />
        </span>
      </button>
    </div>
  ),
};

/**
 * `prefers-reduced-motion` 이 켜진 환경에서는 회전을 멈추는 대신 느리게 돌립니다.
 *
 * 회전 자체가 "로딩 중"이라는 정보이므로 완전히 멈추면 정지된 빈 원만 남아
 * 로딩인지 깨진 화면인지 구분할 수 없게 됩니다.
 *
 * OS 설정을 바꾸거나 DevTools 의 Rendering → Emulate CSS prefers-reduced-motion 으로 확인합니다.
 */
export const ReducedMotion: Story = {
  render: (args) => <Spinner {...args} />,
};
