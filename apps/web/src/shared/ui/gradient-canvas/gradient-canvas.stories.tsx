import type { Meta, StoryObj } from '@storybook/react-vite';

import decorationAvif from '../layout/assets/space-decoration.webp?w=1920;2560&format=avif&quality=75&as=srcset';
import decorationWebp from '../layout/assets/space-decoration.webp?w=1920;2560&format=webp&as=srcset';
import decorationFallback from '../layout/assets/space-decoration.webp?w=1920&format=webp';

import { GradientCanvas } from './gradient-canvas';

const meta = {
  title: 'Primitives/GradientCanvas',
  component: GradientCanvas,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    gradient: {
      control: 'text',
      description: 'CSS 그라데이션. 색은 `--color-space-*` 토큰을 씁니다.',
    },
    fit: {
      control: 'inline-radio',
      options: ['cover'],
      description: '장식을 상자에 맞추는 방식',
      table: { defaultValue: { summary: 'cover' } },
    },
    decorationPriority: {
      control: 'inline-radio',
      options: ['auto', 'high'],
      description: '장식이 첫 화면의 가장 큰 그림(LCP 후보)이면 high',
      table: { defaultValue: { summary: 'auto' } },
    },
  },
  args: {
    gradient:
      'linear-gradient(292.58deg, var(--color-space-start) 3.59%, var(--color-space-end) 95.08%)',
    decoration: {
      avifSrcSet: decorationAvif,
      webpSrcSet: decorationWebp,
      src: decorationFallback,
      sizes: 'max(100vw, 158vh)',
    },
    className: 'flex min-h-svh items-center justify-center',
    children: <p className="text-title1 text-text-1-w">공용 우주 배경</p>,
  },
} satisfies Meta<typeof GradientCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 로그인 · 온보딩 넓은 화면의 공용 우주 배경 */
export const Default: Story = {};
