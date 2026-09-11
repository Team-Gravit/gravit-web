import { useEffect, useMemo, useRef } from 'react';

import type { LeagueTierInfo, Tier } from '@/entities/league';
import { cn } from '@/shared/lib/cn';

export interface TierSelectorProps {
  tiers: Tier[];
  selectedTierId: number | null;
  onSelectTier: (tierId: number) => void;
  selectedTierInfo?: LeagueTierInfo;
}

/**
 * 티어를 가로 스크롤로 훑어보고 하나를 고른다. 선택한 티어는 확대·밝게 표시하고 가운데로 스크롤한다.
 * legacy 구조(양쪽 spacer로 첫/마지막 항목도 가운데 정렬, absolute 아이콘 컨테이너로 확대 시 클리핑 방지)를
 * 그대로 이식하고 크기만 md 기준 반응형으로 얹었다.
 */
export function TierSelector({
  tiers,
  selectedTierId,
  onSelectTier,
  selectedTierInfo,
}: TierSelectorProps) {
  const buttonRefs = useRef(new Map<number, HTMLButtonElement>());
  const hasScrolledRef = useRef(false);

  const selectedIndex = useMemo(() => {
    if (selectedTierId == null) return -1;
    return tiers.findIndex((t) => t.id === selectedTierId);
  }, [tiers, selectedTierId]);

  useEffect(() => {
    if (selectedTierId == null) return;

    const target = buttonRefs.current.get(selectedTierId);
    if (!target) return;

    const raf = requestAnimationFrame(() => {
      // scrollIntoView(inline:'center')는 스크롤 컨테이너 기준으로 정확히 가운데 정렬한다.
      // offsetLeft 수동 계산은 offsetParent가 컨테이너가 아니면 어긋나므로 쓰지 않는다.
      // 첫 정렬은 즉시(애니메이션 중 옆 티어가 걸쳐 보이는 것 방지), 이후 선택은 부드럽게.
      target.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: hasScrolledRef.current ? 'smooth' : 'auto',
      });
      hasScrolledRef.current = true;
    });

    return () => cancelAnimationFrame(raf);
  }, [selectedTierId]);

  return (
    <div className="scrollbar-hide mx-auto flex w-full items-end gap-4 overflow-x-auto [mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)] md:w-[664px] md:items-center md:gap-8 md:py-10">
      <div className="w-[calc(50%-32px)] shrink-0 md:w-[calc(50%-100px)]" />

      {tiers.map((tier, idx) => {
        const isSelected = idx === selectedIndex;
        const TierIcon = tier.icon;

        return (
          <button
            type="button"
            key={tier.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(tier.id, el);
              else buttonRefs.current.delete(tier.id);
            }}
            onClick={() => onSelectTier(tier.id)}
            className="relative flex min-h-37.5 w-16 shrink-0 cursor-pointer flex-col items-center justify-start transition-all duration-300 md:w-55"
          >
            <div className="relative flex h-27.5 w-full items-end justify-center md:h-70 md:items-center">
              <div className="absolute inset-0 flex items-end justify-center md:items-center">
                <TierIcon
                  className="h-20 w-16 origin-bottom transition-transform duration-300 md:h-50 md:w-40 md:origin-center"
                  style={{
                    transform: `scale(${isSelected ? 1.35 : 1})`,
                    filter: `brightness(${isSelected ? 100 : 40}%)`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex w-full flex-col items-center justify-center md:mt-10">
              <span
                aria-hidden={!isSelected}
                className={cn(
                  'whitespace-nowrap text-heading2 font-semibold text-text-1-w transition-opacity duration-300 md:text-display1',
                  isSelected ? 'opacity-100' : 'opacity-0',
                )}
              >
                {tier.name}
              </span>

              {/* LP 범위는 시안상 데스크톱만 노출. 모바일은 티어 이름만 보인다. */}
              <span
                aria-hidden={!(isSelected && selectedTierInfo)}
                className={cn(
                  'hidden whitespace-nowrap font-semibold text-text-1-w transition-opacity duration-300 md:mt-2 md:block md:text-heading1',
                  isSelected && selectedTierInfo ? 'opacity-100' : 'opacity-0',
                )}
              >
                {selectedTierInfo
                  ? `LP ${selectedTierInfo.minLp} - ${selectedTierInfo.maxLp}`
                  : ' '}
              </span>
            </div>
          </button>
        );
      })}

      <div className="w-[calc(50%-32px)] shrink-0 md:w-[calc(50%-100px)]" />
    </div>
  );
}
