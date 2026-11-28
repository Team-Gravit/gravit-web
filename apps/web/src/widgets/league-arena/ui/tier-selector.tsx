import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { TierIcon, type LeagueTierInfo, type Tier } from '@/entities/league';

// 스크롤이 이 시간(ms)만큼 멈춰 있으면 '멈춤'으로 보고 가운데 티어를 선택으로 확정한다.
// scrollend 이벤트는 iOS Safari 지원이 늦어 디바운스로 대체한다.
const SCROLL_IDLE_MS = 120;

// 탭 연타 가드. 겹치는 스크롤·연속 요청·랭킹 remount를 막는다. 스와이프에는 적용하지 않는다.
const TAP_COOLDOWN_MS = 500;

function scrollToCenter(button: HTMLButtonElement | undefined, behavior: ScrollBehavior) {
  button?.scrollIntoView({ inline: 'center', block: 'nearest', behavior });
}

export interface TierSelectorProps {
  tiers: Tier[];
  selectedTierId: number;
  onSelectTier: (tierId: number) => void;
  selectedTierInfo?: LeagueTierInfo;
}

/**
 * 티어를 가로 스크롤(scroll-snap)로 훑어보고 하나를 고른다. 가운데 온 티어를 확대·밝게 표시하고
 * 이름을 중앙 고정 라벨에 보여준다. 선택 확정(LP·랭킹 조회)은 탭하면 즉시, 스와이프하면 멈춘 뒤에 한다.
 *
 * 스와이프 확정 뒤에는 다시 스크롤하지 않아 터치 관성 스크롤(snap)과 충돌하지 않는다.
 */
export function TierSelector({
  tiers,
  selectedTierId,
  onSelectTier,
  selectedTierInfo,
}: TierSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<number, HTMLButtonElement>());

  // 가운데 온 티어(하이라이트·라벨용). 선택 확정값(selectedTierId)과 분리한다.
  const [centeredTierId, setCenteredTierId] = useState(selectedTierId);

  // 센터링 이펙트가 스크롤마다 재실행되지 않도록 ref로도 들고 있는다. null이면 아직 센터링 전이다.
  const centeredIdRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number>(undefined);
  // 탭으로 시작한 smooth 스크롤 중인가. 이전 티어에서 출발하므로 그동안 하이라이트를 덮으면 깜빡인다.
  const isProgrammaticScrollRef = useRef(false);
  const lastTapAtRef = useRef(-Infinity);

  // 스크롤 컨테이너 가운데에 가장 가까운 티어 버튼을 찾는다.
  // getBoundingClientRect는 스케일된 조상(use-scale-to-fit) 안에서도 같은 좌표계 비교라 안전하다.
  function findCenteredTierId(): number | null {
    const container = scrollRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const center = containerRect.left + containerRect.width / 2;

    let nearestId: number | null = null;
    let minDistance = Infinity;
    buttonRefs.current.forEach((button, id) => {
      const rect = button.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < minDistance) {
        minDistance = distance;
        nearestId = id;
      }
    });
    return nearestId;
  }

  function updateCenteredTier(tierId: number) {
    centeredIdRef.current = tierId;
    setCenteredTierId(tierId);
  }

  function handleScroll() {
    // 스크롤 중에는 하이라이트·라벨만 갱신하고 네트워크 요청은 하지 않는다.
    if (!isProgrammaticScrollRef.current) {
      const tierId = findCenteredTierId();
      if (tierId != null) updateCenteredTier(tierId);
    }

    window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(handleScrollEnd, SCROLL_IDLE_MS);
  }

  function handleScrollEnd() {
    // 탭은 클릭할 때 이미 확정했으므로 플래그만 내린다.
    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    // 착지한 티어 하나만 확정해 플릭해도 요청이 몰리지 않는다.
    const settledId = findCenteredTierId();
    if (settledId != null && settledId !== selectedTierId) onSelectTier(settledId);
  }

  // 사용자가 직접 스크롤을 시작하면 탭의 smooth 스크롤은 끝난 것으로 본다.
  function handleUserScrollStart() {
    isProgrammaticScrollRef.current = false;
  }

  function handleTierClick(tierId: number, tappedAt: number) {
    if (tappedAt - lastTapAtRef.current < TAP_COOLDOWN_MS) return;
    lastTapAtRef.current = tappedAt;

    // 이미 가운데인 티어는 scroll 이벤트가 없어, 플래그를 켜면 내릴 기회가 없다.
    isProgrammaticScrollRef.current = tierId !== findCenteredTierId();
    // 센터링 이펙트가 smooth 스크롤을 즉시 점프로 덮지 않도록 확정 전에 맞춘다.
    updateCenteredTier(tierId);
    onSelectTier(tierId);
    scrollToCenter(buttonRefs.current.get(tierId), 'smooth');
  }

  // 초기 진입과 외부에서 selectedTierId가 바뀐 경우(내 티어 변경 등)에만 가운데로 즉시 점프한다.
  useLayoutEffect(() => {
    if (selectedTierId === centeredIdRef.current) return;

    scrollToCenter(buttonRefs.current.get(selectedTierId), 'auto');
    centeredIdRef.current = selectedTierId;
    setCenteredTierId(selectedTierId);
  }, [selectedTierId]);

  useEffect(() => () => window.clearTimeout(idleTimerRef.current), []);

  const centeredTier = tiers.find((tier) => tier.id === centeredTierId);

  // 스크롤 중(가운데 티어 ≠ 확정 티어)에는 LP가 확정 티어 기준이라 어긋난다 → 동기화됐을 때만 노출.
  const isLpVisible = centeredTierId === selectedTierId && Boolean(selectedTierInfo);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleUserScrollStart}
        onWheel={handleUserScrollStart}
        className="scrollbar-hide mx-auto flex w-full snap-x snap-mandatory items-end gap-4 overflow-x-auto [mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)] md:w-[664px] md:items-center md:gap-8 md:py-10"
      >
        <div className="w-[calc(50%-32px)] shrink-0 md:w-[calc(50%-100px)]" />

        {tiers.map((tier) => {
          const isCentered = tier.id === centeredTierId;

          return (
            <button
              type="button"
              key={tier.id}
              ref={(button) => {
                if (button) buttonRefs.current.set(tier.id, button);
                else buttonRefs.current.delete(tier.id);
              }}
              onClick={(event) => handleTierClick(tier.id, event.timeStamp)}
              aria-label={tier.name}
              aria-pressed={tier.id === selectedTierId}
              className="relative flex h-27.5 w-16 shrink-0 cursor-pointer snap-center items-end justify-center md:h-70 md:w-55 md:items-center"
            >
              <TierIcon
                tierId={tier.id}
                className={cn(
                  'h-20 w-16 origin-bottom transition-transform duration-300 md:h-50 md:w-40 md:origin-center',
                  isCentered ? 'scale-135 brightness-100' : 'scale-100 brightness-40',
                )}
              />
            </button>
          );
        })}

        <div className="w-[calc(50%-32px)] shrink-0 md:w-[calc(50%-100px)]" />
      </div>

      <div className="mt-4 flex flex-col items-center md:mt-10">
        <span className="whitespace-nowrap text-heading2 font-semibold text-text-1-w md:text-display1">
          {centeredTier?.name ?? ' '}
        </span>
        {/* LP 범위는 시안상 데스크톱만. 스크롤 중엔 확정 티어와 어긋나 opacity로 가린다(레이아웃은 유지). */}
        <span
          aria-hidden={!isLpVisible}
          className={cn(
            'hidden whitespace-nowrap font-semibold text-text-1-w transition-opacity md:mt-2 md:block md:text-heading1',
            isLpVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          {selectedTierInfo ? `LP ${selectedTierInfo.minLp} - ${selectedTierInfo.maxLp}` : ' '}
        </span>
      </div>
    </div>
  );
}
