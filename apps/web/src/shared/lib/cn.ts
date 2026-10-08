import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 커스텀 타이포 토큰: text-display1, text-body1-normal 등 (tokens.css 의 --text-*)
// tailwind-merge 는 이 이름들을 모르기 때문에 색상 그룹으로 오인하고, 색상 클래스와 충돌시킨다.
// 등록하지 않으면 cn('text-body1-normal', 'text-text-1') 에서 font-size 가 조용히 사라진다.
// 색상 토큰(text-1, main 등)과는 이름이 겹치지 않아 아래 형태로 구분된다.
const isTypographyToken = (value: string) =>
  /^(display|title|heading|headline|label|caption)\d$/.test(value) ||
  /^body\d-(normal|reading)$/.test(value);

// 커스텀 radius 토큰: rounded-{px}
// tailwind-merge 는 숫자 radius 를 모른다(기본 스케일이 t-shirt 사이즈). 등록하지 않으면
// 베이스와 className 의 radius 가 둘 다 남아 className 이 지는 경우가 생긴다.
// theme 에 얹어야 방향별 그룹(rounded-t, rounded-tl 등)까지 함께 커버된다.
const isCustomRadius = (value: string) => /^\d+$/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [isTypographyToken] }],
    },
    theme: {
      radius: [isCustomRadius],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
