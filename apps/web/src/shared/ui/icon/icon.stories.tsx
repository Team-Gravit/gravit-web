import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon, ICONS } from './icon';

const iconNames = Object.keys(ICONS) as Array<keyof typeof ICONS>;

const meta = {
  title: 'Foundations/Iconography',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: '표시할 아이콘 이름',
    },
    size: {
      control: { type: 'range', min: 12, max: 64, step: 4 },
      description: '아이콘의 너비와 높이(px)',
      table: { defaultValue: { summary: '24' } },
    },
    rotate: {
      control: 'inline-radio',
      options: [0, 90, 180, 270],
      description: '상태 전환 애니메이션 등에 사용하는 회전 각도',
      table: { defaultValue: { summary: '0' } },
    },
    className: {
      control: 'text',
      description: '아이콘에 적용할 CSS 클래스',
    },
    'aria-label': {
      control: 'text',
      description: '아이콘 자체가 전달하는 접근 가능한 이름',
    },
    'aria-hidden': {
      control: 'boolean',
      description: '접근성 트리에서 아이콘을 제외할지 여부',
    },
  },
  args: {
    name: 'chevron-right',
    size: 24,
    rotate: 0,
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 아이콘 이름, 크기와 회전 값을 직접 확인할 수 있습니다. */
export const Playground: Story = {};

/** 등록된 전체 아이콘과 이름을 한 화면에서 확인합니다. */
export const AllIcons: Story = {
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
  render: () => (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        width: '100%',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {iconNames.map((name) => (
        <li
          key={name}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: 12,
            minWidth: 0,
            padding: 20,
            border: '1px solid #e5e7eb',
            borderRadius: 8,
          }}
        >
          <Icon name={name} size={24} />
          <code
            style={{
              maxWidth: '100%',
              overflowWrap: 'anywhere',
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            {name}
          </code>
        </li>
      ))}
    </ul>
  ),
};
