import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/shared/ui/button';

import { toast } from './toast';
import { Toaster } from './toaster';

/**
 * 토스트는 명령형 API다. 화면 어디서든 `toast(message, options?)`로 띄우고,
 * 앱 셸에 한 번 마운트한 `<Toaster/>`가 렌더한다. 아래 스토리는 버튼으로 트리거한다.
 */
const meta = {
  title: 'Primitives/Toast',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

const LIMIT_MESSAGE = '오늘 축하 횟수를 모두 사용했어요.';

/** 기본(하단). 모바일에서는 바텀탭 위에 뜬다. */
export const Bottom: Story = {
  render: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <Button size="sm" onClick={() => toast(LIMIT_MESSAGE)}>
        하단 토스트 띄우기
      </Button>
      <Toaster />
    </div>
  ),
};

/** 상단 위치. `position: 'top'` 옵션. */
export const Top: Story = {
  render: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <Button size="sm" onClick={() => toast('상단에 뜨는 토스트입니다.', { position: 'top' })}>
        상단 토스트 띄우기
      </Button>
      <Toaster />
    </div>
  ),
};

/** 긴 메시지. 최대 폭 안에서 줄바꿈된다. */
export const LongMessage: Story = {
  render: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <Button
        size="sm"
        onClick={() =>
          toast('한 줄을 넘어가는 조금 더 긴 안내 메시지 예시입니다. 최대 폭 안에서 줄바꿈됩니다.')
        }
      >
        긴 메시지 토스트
      </Button>
      <Toaster />
    </div>
  ),
};
