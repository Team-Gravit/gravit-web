import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 커스텀 텍스트 토큰: text-{weight}-{size}
// weight 를 명시해 색상 토큰(text-neutral-900 등)과 구분 → font-size 그룹으로만 등록.
// 새 size 는 자동 커버, 새 weight 추가 시에만 아래 목록에 단어 추가.
const isCustomText = (value: string) =>
  /^(extrabold|bold|semibold|medium|regular)-\d+$/.test(value);

// 커스텀 radius 토큰: rounded-{px}
// tailwind-merge 는 숫자 radius 를 모른다(기본 스케일이 t-shirt 사이즈). 등록하지 않으면
// 베이스와 className 의 radius 가 둘 다 남아 className 이 지는 경우가 생긴다.
// theme 에 얹어야 방향별 그룹(rounded-t, rounded-tl 등)까지 함께 커버된다.
const isCustomRadius = (value: string) => /^\d+$/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [isCustomText] }],
    },
    theme: {
      radius: [isCustomRadius],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
