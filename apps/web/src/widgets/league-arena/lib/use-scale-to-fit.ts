import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * ponytail: 임시 scale-to-fit. content(높이를 결정하는 콘텐츠)의 자연 높이가 container 가용 높이를 넘으면,
 * stage 를 그 높이로 레이아웃한 뒤 같은 비율로 통째 균일 축소(transform: scale)해 container 안에 꽉 채운다.
 * 확대(>100%) 시 리그 아레나가 잘리는 걸 막는 임시책 — 제대로 된 반응형 레이아웃으로 대체 예정(별도 FIX).
 *
 * - `stageStyle` 을 축소 대상(아레나 전체)에 적용하면 내부 콘텐츠(랭킹 리스트 포함)가 함께 작아진다.
 * - transform 은 레이아웃 박스를 안 바꾸므로 content.offsetHeight 는 scale 과 무관한 자연 높이다(측정 루프 없음).
 * - 다 들어가면 scale=1, height=가용높이 → h-full 과 동일(평소 레이아웃 보존).
 */
export function useScaleToFit<
  Container extends HTMLElement = HTMLDivElement,
  Content extends HTMLElement = HTMLDivElement,
>() {
  const containerRef = useRef<Container>(null);
  const contentRef = useRef<Content>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const update = () => {
      const available = container.clientHeight;
      const natural = content.offsetHeight;
      if (available <= 0 || natural <= 0) return;
      // 콘텐츠가 가용 높이를 넘으면 그만큼 레이아웃 높이를 키우고 같은 비율로 축소 → 시각적으로 꽉 채움.
      const height = Math.max(available, natural);
      setFit({ scale: available / height, height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const stageStyle: CSSProperties = {
    // 측정 전(height 0)에는 inline height 를 주지 않아 className 의 h-full 이 그대로 적용되게 한다.
    height: fit.height || undefined,
    transform: `scale(${fit.scale})`,
    transformOrigin: 'top center',
  };

  return { containerRef, contentRef, stageStyle };
}
