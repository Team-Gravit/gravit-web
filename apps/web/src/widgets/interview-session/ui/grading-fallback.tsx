import { useEffect, useState } from 'react';

import gradingMascot from './assets/grading-mascot.png';

// 채점 중 순차 노출 문구. 정지화면이 아님을 알리려 일정 간격으로 교체한다.
const GRADING_MESSAGES = [
  '면접관이 알 수 없는 표정을 짓고 있습니다',
  '면접관이 답변을 두 번 다시 읽고 있습니다',
  '면접관이 메모지에 뭔가 적고 있습니다',
  '면접관이 고개를 갸웃거리고 있습니다',
  '면접관이 팔짱을 끼고 생각 중입니다',
];

const MESSAGE_INTERVAL_MS = 3000;
const DOT_INTERVAL_MS = 750;

/** 제출 후 채점 대기 화면. 일러스트(느린 pulse) + 순차 교체 문구 + 점(…) 애니메이션. */
export function GradingFallback() {
  const [index, setIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % GRADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // 0 → 1 → 2 → 3 → 0 … 점이 하나씩 붙었다가 전부 사라진다.
    const id = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, DOT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex h-svh flex-col items-center justify-center gap-10 bg-bg-1 px-4 text-center md:gap-6">
      <img
        src={gradingMascot}
        alt=""
        className="h-[175px] w-auto object-contain motion-safe:animate-pulse motion-safe:[animation-duration:4s] md:h-[306px]"
      />
      <p className="text-heading1 text-text-1 md:text-title2">
        <span aria-live="polite">{GRADING_MESSAGES[index]}</span>
        {/* 점은 장식이라 스크린리더에서 제외하고, 폭을 고정해(opacity) 글자가 밀리지 않게 한다. */}
        <span aria-hidden="true" className="inline-flex">
          <span className={dotCount >= 1 ? undefined : 'opacity-0'}>.</span>
          <span className={dotCount >= 2 ? undefined : 'opacity-0'}>.</span>
          <span className={dotCount >= 3 ? undefined : 'opacity-0'}>.</span>
        </span>
      </p>
    </main>
  );
}
