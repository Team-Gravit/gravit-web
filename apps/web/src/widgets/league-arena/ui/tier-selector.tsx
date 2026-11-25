import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { TierIcon, type LeagueTierInfo, type Tier } from '@/entities/league';

// 스크롤이 이 시간(ms)만큼 멈춰 있으면 '멈춤'으로 보고 가운데 티어를 선택으로 확정한다.
// scrollend 이벤트는 iOS Safari 지원이 늦어 디바운스로 대체한다.
const SCROLL_IDLE_MS = 120;

// 탭 연타 가드(ms). 이 시간 안의 추가 탭은 무시한다 — 겹치는 스크롤·연속 요청·랭킹 remount 방지.
// 스와이프는 이 가드를 거치지 않는다.
const TAP_COOLDOWN_MS = 500;

export interface TierSelectorProps {
  tiers: Tier[];
  selectedTierId: number | null;
  onSelectTier: (tierId: number) => void;
  selectedTierInfo?: LeagueTierInfo;
}

/**
 * 티어를 가로 스크롤(scroll-snap)로 훑어보고 하나를 고른다. 가운데 온 티어를 확대·밝게 표시하고
 * 이름을 중앙 고정 라벨에 보여준다. 선택 확정(LP·랭킹 조회)은 탭 시 즉시, 스와이프 시 멈춘 뒤 1회만 한다.
 *
 * 스크롤은 브라우저(snap)가 소유한다. 명령형 smooth 스크롤을 선택마다 쏘지 않아 터치 관성 스크롤과
 * 충돌하지 않는다. 가운데 티어는 스크롤 위치로 판정하므로 라벨이 버튼마다 따라다니며 겹치지 않는다.
 */
export function TierSelector({
  tiers,
  selectedTierId,
  onSelectTier,
  selectedTierInfo,
}: TierSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<number, HTMLButtonElement>());

  // 가운데 온 티어(실시간, 하이라이트·라벨용). 선택 확정값(selectedTierId)과 분리한다.
  const [centeredTierId, setCenteredTierId] = useState<number | null>(selectedTierId);

  // 센터링 효과가 매 스크롤마다 재실행되지 않도록 최신 centeredTierId를 ref로 읽는다.
  // ref 쓰기는 렌더 본문이 아니라 핸들러·이펙트 안에서만 한다(React 19 제약).
  const centeredIdRef = useRef(centeredTierId);
  const hasCenteredRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);
  // 탭으로 시작한 smooth 스크롤이 진행 중인가. 이 동안엔 스크롤 위치로 하이라이트를 덮지 않는다.
  const isProgrammaticScrollRef = useRef(false);
  // 탭 쿨다운 잠금. 탭 후 TAP_COOLDOWN_MS 동안 true → 그 사이 추가 탭은 무시한다.
  const tapLockedRef = useRef(false);
  const tapLockTimerRef = useRef<number | null>(null);

  // 스크롤 컨테이너 가운데에 가장 가까운 티어 버튼을 찾는다.
  // getBoundingClientRect는 스케일된 조상(use-scale-to-fit) 안에서도 같은 좌표계 비교라 안전하다.
  function findCenteredTierId(): number | null {
    const container = scrollRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const center = containerRect.left + containerRect.width / 2;

    let nearestId: number | null = null;
    let minDistance = Infinity;
    buttonRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < minDistance) {
        minDistance = distance;
        nearestId = id;
      }
    });
    return nearestId;
  }

  function handleScroll() {
    // 탭으로 시작한 smooth 스크롤 중엔 스크롤 위치로 하이라이트를 덮어쓰지 않는다.
    // 목표는 이미 정해졌는데 애니메이션 시작 지점이 이전 티어라, 덮으면 1→2→1→2로 깜빡인다.
    // 스크롤이 멈추면(= 애니메이션 종료) 플래그를 내린다.
    if (isProgrammaticScrollRef.current) {
      if (idleTimerRef.current != null) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, SCROLL_IDLE_MS);
      return;
    }

    const current = findCenteredTierId();
    if (current != null && current !== centeredIdRef.current) {
      setCenteredTierId(current); // 하이라이트·라벨만 갱신. 네트워크 요청은 하지 않는다.
      centeredIdRef.current = current;
    }

    if (idleTimerRef.current != null) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      const settled = findCenteredTierId();
      if (settled != null && settled !== selectedTierId) {
        onSelectTier(settled); // 멈춘 뒤 착지 티어 1개만 확정 → 플릭해도 요청이 몰리지 않는다.
      }
    }, SCROLL_IDLE_MS);
  }

  function handleTierClick(tierId: number) {
    if (tapLockedRef.current) return; // 가드: 쿨다운 중 연타 무시
    tapLockedRef.current = true;
    if (tapLockTimerRef.current != null) clearTimeout(tapLockTimerRef.current);
    tapLockTimerRef.current = window.setTimeout(() => {
      tapLockedRef.current = false;
    }, TAP_COOLDOWN_MS);

    isProgrammaticScrollRef.current = true; // 아래 smooth 스크롤 동안 handleScroll의 하이라이트 덮기 차단
    setCenteredTierId(tierId); // 아래 센터링 효과가 탭의 smooth 스크롤과 싸우지 않도록 먼저 맞춘다.
    centeredIdRef.current = tierId;
    onSelectTier(tierId); // 탭은 즉시 확정(즉각 반응). 스와이프만 idle 확정에 맡긴다.
    buttonRefs.current
      .get(tierId)
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  // 초기 진입과 외부에서 selectedTierId가 바뀐 경우(내 티어 변경 등)에만 가운데로 즉시 점프한다.
  // 탭/스와이프로 생긴 확정은 centeredTierId와 이미 같아 여기서 다시 스크롤하지 않는다.
  useLayoutEffect(() => {
    if (selectedTierId == null) return;
    if (hasCenteredRef.current && selectedTierId === centeredIdRef.current) return;

    buttonRefs.current
      .get(selectedTierId)
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' });
    setCenteredTierId(selectedTierId);
    centeredIdRef.current = selectedTierId;
    hasCenteredRef.current = true;
  }, [selectedTierId]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current != null) clearTimeout(idleTimerRef.current);
      if (tapLockTimerRef.current != null) clearTimeout(tapLockTimerRef.current);
    };
  }, []);

  const centeredTier =
    centeredTierId == null ? undefined : tiers.find((t) => t.id === centeredTierId);

  // 스크롤 중(가운데 티어 ≠ 확정 티어)에는 LP가 확정 티어 기준이라 어긋난다 → 동기화됐을 때만 노출.
  const isLpVisible = centeredTierId === selectedTierId && Boolean(selectedTierInfo);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide mx-auto flex w-full snap-x snap-mandatory items-end gap-4 overflow-x-auto [mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)] md:w-[664px] md:items-center md:gap-8 md:py-10"
      >
        <div className="w-[calc(50%-32px)] shrink-0 md:w-[calc(50%-100px)]" />

        {tiers.map((tier) => {
          const isCentered = tier.id === centeredTierId;

          return (
            <button
              type="button"
              key={tier.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(tier.id, el);
                else buttonRefs.current.delete(tier.id);
              }}
              onClick={() => handleTierClick(tier.id)}
              aria-label={tier.name}
              className="relative flex h-27.5 w-16 shrink-0 cursor-pointer snap-center items-end justify-center md:h-70 md:w-55 md:items-center"
            >
              <div className="absolute inset-0 flex items-end justify-center md:items-center">
                <TierIcon
                  tierId={tier.id}
                  className="h-20 w-16 origin-bottom transition-transform duration-300 md:h-50 md:w-40 md:origin-center"
                  style={{
                    transform: `scale(${isCentered ? 1.35 : 1})`,
                    filter: `brightness(${isCentered ? 100 : 40}%)`,
                  }}
                />
              </div>
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
