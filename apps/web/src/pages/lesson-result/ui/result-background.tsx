import { cn } from '@/shared/lib/cn';

import { markImageReadyAfterDecode } from '../lib/image-loading';
import desktopDecorationAvif from './assets/background-decoration-desktop.webp?w=1920;2880;3840&format=avif&quality=75&as=srcset';
import desktopDecorationWebp from './assets/background-decoration-desktop.webp?w=1920;2880;3840&format=webp&as=srcset';
import mobileDecorationImage from './assets/background-decoration-mobile.webp';

export interface ResultBackgroundProps {
  isVisible: boolean;
  onReady: () => void;
}

export function ResultBackground({ isVisible, onReady }: ResultBackgroundProps) {
  return (
    <div aria-hidden data-slot="result-background" className="absolute inset-0 z-0 overflow-hidden">
      <picture
        data-slot="background-decoration"
        data-visible={isVisible || undefined}
        className={cn(
          'absolute inset-0 block opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none',
          isVisible && 'opacity-100',
        )}
      >
        {/* object-cover 라 세로로 긴 화면에서는 높이에 맞춰 커진다. 원본 비율(4320:3051 ≈ 1.42)만큼 vh 로도 잰다. */}
        <source
          media="(min-width: 768px)"
          type="image/avif"
          srcSet={desktopDecorationAvif}
          sizes="max(100vw, 142vh)"
        />
        <source
          media="(min-width: 768px)"
          type="image/webp"
          srcSet={desktopDecorationWebp}
          sizes="max(100vw, 142vh)"
        />
        <img
          src={mobileDecorationImage}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-top"
          onLoad={(event) => markImageReadyAfterDecode(event.currentTarget, onReady)}
          onError={onReady}
        />
      </picture>
      <div
        className={cn(
          'absolute inset-0 z-10 bg-secondary-1/60 transition-colors duration-500 ease-out motion-reduce:transition-none',
          isVisible && 'bg-secondary-1/40',
        )}
      />
    </div>
  );
}
