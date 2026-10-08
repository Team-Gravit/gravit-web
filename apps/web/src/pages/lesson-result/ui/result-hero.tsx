import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { getPlanetImage, getPlanetName } from '@/entities/learning';

import { markImageReadyAfterDecode } from '../lib/image-loading';
import mascotImage from './assets/mascot.webp';
import mobileMoonImage from './assets/moon-mobile.webp';

export interface ResultHeroProps {
  chapterId: number;
  unitTitle: string;
  isIllustrationVisible: boolean;
  onIllustrationReady: () => void;
}

/**
 * 결과 화면의 제목과 중앙 일러스트(토끼 + 행성)를 렌더링하는 부분
 */
export function ResultHero({
  chapterId,
  unitTitle,
  isIllustrationVisible,
  onIllustrationReady,
}: ResultHeroProps) {
  const isWideViewport = useIsWideViewport();
  const planetImageSrc = getPlanetImage(chapterId);

  // 이미지의 준비 상태를 관리하는 state
  const [isMascotReady, setIsMascotReady] = useState(false);
  const [isMobileMoonReady, setIsMobileMoonReady] = useState(false);
  const [readyPlanetImageSrc, setReadyPlanetImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const isPlanetReady = !planetImageSrc || readyPlanetImageSrc === planetImageSrc;
    const isMoonReadyForViewport = isWideViewport || isMobileMoonReady;
    const isIllustrationReady = isMascotReady && isMoonReadyForViewport && isPlanetReady;

    if (isIllustrationReady) {
      onIllustrationReady();
    }
  }, [
    isMascotReady,
    isMobileMoonReady,
    isWideViewport,
    onIllustrationReady,
    planetImageSrc,
    readyPlanetImageSrc,
  ]);

  // 챕터에 해당하는 행성 이름 - 없으면 unitTitle로 대체
  const conquestTargetName = getPlanetName(chapterId) ?? unitTitle;

  return (
    <div
      data-slot="result-hero"
      className="flex min-h-0 flex-1 flex-col items-center md:flex-none md:gap-8"
    >
      <hgroup className="flex flex-col items-center gap-1 text-center md:gap-2">
        <h1 className="text-heading1 text-text-1-w md:text-title2">
          {conquestTargetName} 정복에 더 가까워졌어요!
        </h1>
        <p className="text-label2 text-text-2-w md:text-headline1">{unitTitle} 학습 완료</p>
      </hgroup>

      {/* 시안 비율(모바일 283×282, 데스크톱 307×235)을 유지하며 남는 높이에 맞춰 줄인다. */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-[1.875rem] md:flex-none md:py-0">
        <div
          aria-hidden
          data-visible={isIllustrationVisible || undefined}
          className={cn(
            'relative aspect-[283/282] h-[74.73vw] max-h-full w-auto opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none',
            'md:aspect-[307/235] md:h-[14.6875rem] md:max-h-none md:w-[19.1875rem]',
            isIllustrationVisible && 'opacity-100',
          )}
        >
          {/* 달도 같은 좌표계에 배치해 화면 높이가 달라져도 마스코트와의 겹침을 유지한다. */}
          {isWideViewport ? null : (
            <div
              data-slot="mobile-moon"
              className="absolute top-[83.33%] left-[24.31%] w-[138vw] -translate-x-1/2"
            >
              <img
                src={mobileMoonImage}
                alt=""
                decoding="async"
                className="w-full -translate-y-[5.3%]"
                onLoad={(event) =>
                  markImageReadyAfterDecode(event.currentTarget, () => setIsMobileMoonReady(true))
                }
                onError={() => setIsMobileMoonReady(true)}
              />
            </div>
          )}
          <img
            src={mascotImage}
            alt=""
            decoding="async"
            className="absolute top-[16.67%] left-0 h-[83.33%] w-auto md:top-0 md:h-full"
            onLoad={(event) =>
              markImageReadyAfterDecode(event.currentTarget, () => setIsMascotReady(true))
            }
            onError={() => setIsMascotReady(true)}
          />
          {planetImageSrc ? (
            <img
              src={planetImageSrc}
              alt=""
              decoding="async"
              className="absolute top-0 left-[62.19%] w-[37.81%] md:top-[8.09%] md:left-[65.15%] md:w-[34.85%]"
              onLoad={(event) =>
                markImageReadyAfterDecode(event.currentTarget, () =>
                  setReadyPlanetImageSrc(planetImageSrc),
                )
              }
              onError={() => setReadyPlanetImageSrc(planetImageSrc)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
