import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '@/shared/ui/icon';

import { Button } from './button';

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'stroke-default',
  'stroke-secondary',
  'ghost',
] as const;
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: BUTTON_VARIANTS,
      description: '버튼의 시각 스타일',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'inline-radio',
      options: [...BUTTON_SIZES, 'cta', 'icon'],
      description:
        '버튼의 크기. 브레이크포인트마다 다르게 주려면 `{ base, md }` 형태를 사용합니다.',
      table: { defaultValue: { summary: 'md' } },
    },
    isLoading: {
      control: 'boolean',
      description: '진행 중인 작업이 있는 상태. 중복 실행을 막고 진행 상태를 알립니다.',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    children: {
      control: 'text',
      description: '버튼 레이블',
    },
    startIcon: { control: false, description: '레이블 앞에 붙는 아이콘' },
    endIcon: { control: false, description: '레이블 뒤에 붙는 아이콘' },
  },
  args: {
    variant: 'default',
    size: 'md',
    isLoading: false,
    disabled: false,
    children: '시작하기',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/** variant, size, 상태를 컨트롤로 조작합니다. */
export const Playground: Story = {};

/** 제공되는 시각 스타일을 동일한 조건에서 비교합니다. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button {...args} key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** 크기 스케일을 비교합니다. 높이·좌우 여백·타이포가 함께 바뀝니다. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {BUTTON_SIZES.map((size) => (
        <Button {...args} key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

/**
 * 브레이크포인트마다 다른 크기를 지정합니다.
 *
 * 앱은 WebView 로 같은 웹앱을 좁은 뷰포트에서 보여주므로, 앱과 웹의 크기 차이는
 * 플랫폼 분기가 아니라 `md` 브레이크포인트로 처리합니다.
 * 아래 버튼은 768px 미만에서 `sm`, 이상에서 `lg` 로 렌더됩니다. 뷰포트를 조절해 확인하세요.
 */
export const ResponsiveSize: Story = {
  args: {
    size: { base: 'sm', md: 'lg' },
    children: '뷰포트를 줄여보세요',
  },
};

/**
 * 화면 하단 등에 쓰이는 block CTA 입니다.
 *
 * 모바일과 데스크톱 크기가 한 쌍으로 고정되어 있어 `size` 값 자체에 반응형을 포함합니다.
 * 그래서 `cta` 는 `{ base, md }` 조합 대상에서 타입으로 제외됩니다.
 */
export const BlockCta: Story = {
  parameters: { layout: 'padded' },
  args: { size: 'cta', children: '학습 시작하기' },
};

/**
 * 레이블 앞뒤에 아이콘을 붙입니다.
 *
 * 자식에 특정 data 속성을 붙이는 대신 `startIcon` / `endIcon` 으로 받아
 * 배치와 여백을 버튼이 책임집니다.
 */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} startIcon={<Icon name="plus" size={16} />}>
        추가하기
      </Button>
      <Button {...args} variant="stroke-default" endIcon={<Icon name="chevron-right" size={16} />}>
        다음으로
      </Button>
    </div>
  ),
};

/**
 * 로딩 중에는 레이블 자리를 유지한 채 스피너를 겹칩니다. 전환 시 버튼 폭이 변하지 않습니다.
 *
 * 스피너 색은 `currentColor` 를 상속하므로 variant 마다 따로 지정하지 않습니다.
 * 안내는 버튼의 `aria-busy` 가 담당하고 스피너는 `label={null}` 로 침묵시켜, 로딩이 두 번 읽히지 않습니다.
 */
export const Loading: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button {...args} key={variant} variant={variant} isLoading>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** variant 마다 서로 다른 비활성 스타일을 비교합니다. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button {...args} key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/**
 * 겉모습은 버튼이지만 실제로는 링크(`<a>`)로 동작합니다. Radix `Slot` 으로 렌더 엘리먼트를 자식에 위임합니다.
 *
 * `<a>` 에는 `disabled` 가 유효하지 않으므로, 이 경우 `aria-disabled` 와
 * pointer-events 차단으로 같은 효과를 냅니다.
 */
export const AsChildLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://storybook.js.org" target="_blank" rel="noreferrer">
        새 탭에서 열기
      </a>
    </Button>
  ),
};

/**
 * 값이 올바르지 않을 때의 상태입니다. `aria-invalid` 가 붙으면 에러 보더와 링이 나타납니다.
 * 스크린 리더에도 유효하지 않은 값임이 전달됩니다.
 */
export const Invalid: Story = {
  args: { 'aria-invalid': true, children: '다시 확인해주세요' },
};

/**
 * 드롭다운·메뉴를 여는 버튼입니다. `aria-haspopup` 이 있으면 눌림 효과가 빠져,
 * 메뉴가 열릴 때 버튼이 덜컹이지 않습니다.
 */
export const HasPopupTrigger: Story = {
  args: {
    'aria-haspopup': 'menu',
    variant: 'stroke-secondary',
    children: '메뉴 열기',
    endIcon: <Icon name="chevron-down" size={16} />,
  },
};
