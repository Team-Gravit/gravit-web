import type { GradientCanvasArt } from '@/shared/ui/gradient-canvas';

import bannerWebpSrcSet from './assets/space-banner.png?w=1920;3840&format=webp&as=srcset';
import bannerDefaultSrc from './assets/space-banner.png?w=1920&format=webp';

/**
 * 시안의 1920×274 우주 배너를 메인 히어로와 마이 프로필 카드에서 공유한다.
 * 내부 그림 상자에 같은 비율을 지정해야 그라데이션과 투명 장식의 구도가 맞는다.
 */
export const SPACE_BANNER_ART: GradientCanvasArt = {
  gradient:
    'linear-gradient(334.85deg, var(--color-space-start) -2.12%, var(--color-space-end) 97.79%)',
  decoration: {
    webpSrcSet: bannerWebpSrcSet,
    src: bannerDefaultSrc,
    sizes: 'max(100vw, 1920px)',
  },
};
