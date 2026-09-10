import type { Meta, StoryObj } from '@storybook/react-vite';

import { GravitLogo } from './logo';
import { GravitSymbol } from './symbol';

const meta = {
  title: 'Primitives/Logo',
  component: GravitLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['gradient', 'mono'],
      description: 'gradient 는 브랜드 그라디언트, mono 는 currentColor 단색',
      table: { defaultValue: { summary: 'gradient' } },
    },
    className: {
      control: 'text',
      description: '크기와 색. 높이만 지정하고 폭은 w-auto 로 두어 비율을 유지합니다.',
    },
  },
  args: {
    variant: 'gradient',
    className: 'h-15 w-auto',
  },
} satisfies Meta<typeof GravitLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 변형과 크기를 컨트롤로 조작합니다. */
export const Playground: Story = {};

/**
 * 로고는 두 가지 형태가 있고 서로 대체재가 아닙니다.
 *
 * - **워드마크**(`GravitLogo`) — "Gravit!" 글자가 들어간 가로로 긴 형태.
 *   화면에 여유가 있을 때 씁니다. 넓은 화면 로그인 카드가 이걸 씁니다.
 * - **심볼**(`GravitSymbol`) — 토끼 마크만 있는 정사각형.
 *   폭이 좁거나 작은 자리에서 씁니다. 좁은 화면 로그인이 이걸 씁니다.
 *
 * 둘 다 `svg` 를 그대로 반환하므로 `Icon` 이 아니라 `className` 으로 크기를 정합니다.
 * 워드마크는 가로로 길어 `Icon` 의 정사각형 강제와 맞지 않습니다.
 */
export const Marks: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-wrap items-end gap-10">
      <div className="flex flex-col items-center gap-2">
        <GravitLogo {...args} />
        <span className="text-xs text-text-3">GravitLogo — 워드마크</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <GravitSymbol className="w-18 text-main" />
        <span className="text-xs text-text-3">GravitSymbol — 심볼</span>
      </div>
    </div>
  ),
};

/**
 * 워드마크의 두 변형입니다.
 *
 * `mono` 는 색을 `currentColor` 로 받으므로 부모의 글자색만 바꾸면 따라옵니다.
 * 배경 대비를 직접 맞춰야 할 때(어두운 배경, 단색 카드) 이쪽을 씁니다.
 */
export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-wrap items-end gap-10">
      <div className="flex flex-col items-center gap-2">
        <GravitLogo {...args} variant="gradient" />
        <span className="text-xs text-text-3">gradient</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-cta">
        <GravitLogo {...args} variant="mono" />
        <span className="text-xs text-text-3">mono · text-cta</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-12 bg-main p-6 text-white">
        <GravitLogo {...args} variant="mono" />
        <span className="text-xs text-white">mono · 어두운 배경 위</span>
      </div>
    </div>
  ),
};

/**
 * 심볼은 정사각형이라 폭만 지정하면 됩니다. 색은 `currentColor` 를 따릅니다.
 *
 * 크기 토큰이 따로 없으므로 쓰는 자리에서 정합니다. 로그인 좁은 화면은 `w-18`(72px)을 씁니다.
 */
export const SymbolSizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {(['w-8', 'w-12', 'w-18'] as const).map((width) => (
        <div key={width} className="flex flex-col items-center gap-2">
          <GravitSymbol className={`${width} text-main`} />
          <span className="text-xs text-text-3">{width}</span>
        </div>
      ))}
    </div>
  ),
};
