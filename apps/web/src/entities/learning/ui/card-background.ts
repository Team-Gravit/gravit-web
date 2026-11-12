import type { GradientCanvasArt } from '@/shared/ui/gradient-canvas';

import chapterDecorationSrc from './assets/chapter-card-decoration.png?w=710&format=webp';
import unitDecorationSrc from './assets/unit-card-decoration.png?w=800&format=webp';

/*
  시안 `card-background`(589×377)를 두 카드가 나눠 쓴다.
  - 챕터 카드: 안쪽 `crop` 프레임(x 64 · 355×377). 그라데이션도 crop 상자 기준으로 옮긴 정지점이다
  - 유닛 카드: 프레임 전체를 카드에 맞춰 덮는다(cover). 카드 폭에 따라 양옆이나 위아래가 잘린다
*/

export const CHAPTER_CARD_BACKGROUND: GradientCanvasArt = {
  gradient:
    'linear-gradient(303.01deg, var(--color-space-start) -23.34%, var(--color-space-end) 103.83%)',
  decoration: { src: chapterDecorationSrc },
};

// 챕터 카드(정사각형)는 crop(355:377)보다 넓적해서 폭에 맞추고 세로 가운데에 두면 cover다.
export const CHAPTER_CARD_BACKGROUND_FIT_CLASS =
  'top-1/2 bottom-auto aspect-355/377 -translate-y-1/2';

export const UNIT_CARD_BACKGROUND: GradientCanvasArt = {
  gradient:
    'linear-gradient(303.01deg, var(--color-space-start) 3.59%, var(--color-space-end) 95.08%)',
  decoration: { src: unitDecorationSrc },
};

// 유닛 카드는 화면에 따라 그림보다 좁기도 넓기도 하다. 캔버스 크기를 기준으로 폭 · 높이 중 큰 쪽에 맞춘다.
export const UNIT_CARD_BACKGROUND_CONTAINER_CLASS = 'absolute inset-0 [container-type:size]';
export const UNIT_CARD_BACKGROUND_FIT_CLASS =
  'inset-auto top-1/2 left-1/2 aspect-589/377 w-[max(100cqw,calc(100cqh*589/377))] -translate-1/2';
