import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다양한 상황에서 사용할 수 있는 범용 버튼 컴포넌트입니다. `variant`와 `size`로 시각적 스타일을 조정하고, `display`로 인라인/블록 레이아웃을 선택하세요.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: '버튼 내부에 표시할 텍스트 또는 콘텐츠입니다.',
    },
    variant: {
      description:
        '버튼의 시각적 스타일을 결정합니다. `display="block"`일 때는 `primary`, `secondary`만 사용 가능합니다.',
    },
    size: {
      description: '버튼의 크기를 결정합니다. `display="block"`일 때는 `md`로 고정됩니다.',
    },
    disabled: {
      description:
        'true일 때 버튼을 비활성화합니다. 회색으로 표시되며 클릭이 불가능합니다. `loading`이 true이면 자동으로 비활성화됩니다.',
    },
    loading: {
      description:
        'true일 때 로딩 상태로 전환됩니다. 버튼이 자동으로 비활성화되고 `loadingText`를 표시합니다.',
    },
    loadingText: {
      description: '`loading`이 true일 때 표시할 텍스트입니다. 기본값은 `"로딩 중..."`입니다.',
    },
  },
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Inline Variants
export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const StrokeGray: Story = {
  args: { variant: 'strokeGray' },
};

export const StrokePrimary: Story = {
  args: { variant: 'strokePrimary' },
};

// Sizes
export const ExtraSmall: Story = {
  args: { size: 'xs' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

// States
export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const LoadingWithCustomText: Story = {
  args: { loading: true, loadingText: '저장 중...' },
};

// 한눈에 보기
export const AllVariants: Story = {
  name: 'Variants — 한눈에',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {(['primary', 'secondary', 'strokeGray', 'strokePrimary'] as const).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'Sizes — 한눈에',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} variant="primary" size={size}>
          {size.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};

export const AllStates: Story = {
  name: 'States — 한눈에',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <Button variant="primary">Default</Button>
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary" loading loadingText="저장 중...">
        저장 중...
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};

// Block display
export const Block: Story = {
  render: ({ children, disabled, loading, loadingText }) => (
    <div style={{ width: '320px' }}>
      <Button
        display="block"
        variant="primary"
        disabled={disabled}
        loading={loading}
        loadingText={loadingText}
      >
        {children}
      </Button>
    </div>
  ),
  argTypes: {
    display: { control: false },
    variant: { control: false },
    size: { control: false },
  },
};

export const BlockSecondary: Story = {
  render: ({ children, disabled, loading, loadingText }) => (
    <div style={{ width: '320px' }}>
      <Button
        display="block"
        variant="secondary"
        disabled={disabled}
        loading={loading}
        loadingText={loadingText}
      >
        {children}
      </Button>
    </div>
  ),
  argTypes: {
    display: { control: false },
    variant: { control: false },
    size: { control: false },
  },
};

export const BlockLoading: Story = {
  render: ({ children, disabled, loadingText }) => (
    <div style={{ width: '320px' }}>
      <Button
        display="block"
        variant="primary"
        loading
        disabled={disabled}
        loadingText={loadingText}
      >
        {children}
      </Button>
    </div>
  ),
  argTypes: {
    display: { control: false },
    variant: { control: false },
    size: { control: false },
    loading: { control: false },
  },
};
