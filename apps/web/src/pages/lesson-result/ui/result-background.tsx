import { cn } from '@/shared/lib/cn';

import { markImageReadyAfterDecode } from '../lib/image-loading';
import desktopDecorationImage from './assets/background-decoration-desktop.webp';
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
        <source media="(min-width: 768px)" srcSet={desktopDecorationImage} />
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
