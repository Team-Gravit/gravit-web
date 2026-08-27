import type { Meta, StoryObj } from '@storybook/react-vite';

import pcBackgroundImage from '@/shared/assets/images/banner.webp';
import { withTanstackRouter } from '@/shared/lib/test/with-router';

import { DEFAULT_HEADER_NAV_LIST } from '../config/nav';
import HeaderContent from './header-content';

const meta = {
  component: HeaderContent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    navList: DEFAULT_HEADER_NAV_LIST,
    variant: 'overlay',
  },
  argTypes: {
    navList: {
      description: '헤더 네비게이션 리스트',
    },
    variant: {
      description: '헤더 스타일 variant',
    },
  },
  decorators: [
    (Story, { args: { variant } }) => (
      <div
        style={{
          zoom: 0.75,
          minWidth: 1280,
          backgroundImage: variant === 'overlay' ? `url(${pcBackgroundImage})` : undefined,
        }}
        className="w-full p-4 bg-center"
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overlay: Story = {};

export const Solid: Story = {
  args: {
    variant: 'solid',
  },
};
export const MainActive: Story = {
  name: '홈 활성화 (Overlay)',
  decorators: [
    withTanstackRouter({
      routeId: '/_authenticated/_overlay-header-layout/main',
      path: '/main',
    }),
  ],
};

export const LearningActive: Story = {
  name: '학습 활성화 (Overlay)',
  decorators: [
    withTanstackRouter({
      routeId: '/_authenticated/_overlay-header-layout/learning/',
      path: '/learning',
    }),
  ],
};

export const LeagueActive: Story = {
  name: '리그 활성화 (Overlay)',
  decorators: [
    withTanstackRouter({
      routeId: '/_authenticated/_fixed-header-layout/league',
      path: '/league',
    }),
  ],
};

export const UserActive: Story = {
  name: '마이그래빗 활성화 (Overlay)',
  decorators: [
    withTanstackRouter({
      routeId: '/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/',
      path: '/user',
    }),
  ],
};
