import { Lottie } from 'lottie-react';
import { useEffect } from 'react';

import DesktopAchievementBackground from '@/shared/assets/_images/background/desktop-achievement-bg.png';
import MobileAchievementBackground from '@/shared/assets/_images/background/mobile-achievement-bg.png';
import ConfettiLottie from '@/shared/assets/lottie/confetti-motion.json';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';

import { getAchievementModalContent } from './model/achievement-modal-config';
import { useAchievementModal } from './model/use-achievement-modal-store';

function AchievementModal() {
  const { achievement, isOpen, close } = useAchievementModal();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style = 'hidden';
    }

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { Icon, message, subTitle, title, gradientColor } = getAchievementModalContent(
    achievement!,
  );
  return (
    <div className="w-vw h-svh fixed inset-0 z-60 flex items-center justify-center p-4">
      <picture className="absolute inset-0">
        <source media="(max-width: 768px)" srcSet={MobileAchievementBackground} />
        <img src={DesktopAchievementBackground} className="w-full h-full z-50" />
      </picture>
      <div className="bg-[#000000]/50  w-full h-full absolute inset-0" />

      <div
        role="dialog"
        aria-modal
        className={cn(
          'overflow-hidden bg-gradient-to-tl to-white/25 from-white/10 to-100%  backdrop-blur-xl drop-shadow-[0_4px_32px_0,rgba(0,0,0,2.4)]',
          'max-w-[630px] w-full flex items-center justify-center flex-col p-4 pt-9 md:p-8',
          'border border-white/30 rounded-lg md:rounded-xl',
        )}
      >
        <div className="relative flex items-center justify-center w-full h-50 mb-10 md:mb-8">
          {typeof Icon === 'string' ? (
            <div className="absolute inset-0 overflow-hidden flex justify-center md:items-start">
              <img
                src={Icon}
                alt="업적을 축하하는 그래빗 마스코트 이미지"
                className={cn(
                  'h-full object-contain z-10 md:object-cover md:w-[177px]',
                  achievement!.status === 'levelUp' &&
                    'md:h-auto md:w-[190px] md:translate-y-2 translate-x-1 md:translate-x-2',
                )}
              />
            </div>
          ) : (
            <Icon
              aria-label={`${subTitle.highlight} 이미지`}
              className="z-10 h-full w-auto pointer-events-none"
            />
          )}
          <div
            className="opacity-50 blur-2xl rounded-full size-[200px] md:size-[250px] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{
              background: `radial-gradient(circle, ${gradientColor.from}, ${gradientColor.to})`,
            }}
          />
          <Lottie
            aria-hidden
            src={ConfettiLottie}
            autoplay
            loop
            speed={0.6}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 size-150 md:size-140"
          />
        </div>

        <div className="text-center mb-3 md:mb-5">
          <h4 className="text-title3 md:text-title1 text-text-1-w mb-1 md:mb-2">
            <span aria-hidden className="text-heading2 md:hidden">
              🎉
            </span>
            <span className="mx-1.5">{title}</span>
            <span aria-hidden className="text-heading2 md:hidden">
              🎉
            </span>
          </h4>

          <p className="text-text-1-w">
            {subTitle.highlight && (
              <span className="text-headline2 md:text-title3 mr-1">{subTitle.highlight}</span>
            )}
            <span className="text-body2 md:text-heading1 md:opacity-80">{subTitle.common}</span>
          </p>
        </div>

        <div className="mb-6 md:mb-10 w-full rounded-lg md:rounded-xl border border-text-1-w/16 py-3 md:py-4.5 px-4 md:px-5 text-center">
          <p className="text-text-1-w text-caption1 md:text-label1">{message}</p>
        </div>

        <Button
          onClick={close}
          variant="secondary"
          size="custom"
          className="w-full text-headline2 text-text-2 py-3 md:h-[54px]"
        >
          계속하기
        </Button>
      </div>
    </div>
  );
}

export default AchievementModal;
