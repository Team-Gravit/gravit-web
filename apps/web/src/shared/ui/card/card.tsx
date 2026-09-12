import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

// 시안의 카드 배경은 bg/0(#fff)이나 apps/web 토큰 체계엔 bg-0 이 없어 Tailwind 기본 white 를 쓴다.
// bg-0 토큰 도입은 별도 판단(design-source-policy §6). legacy Card 도 bg-white 를 썼다.
const cardVariants = cva('flex flex-col bg-white', {
  variants: {
    size: {
      sm: 'gap-2 rounded-8 p-3',
      md: 'gap-2 rounded-8 p-3 md:gap-4 md:rounded-12 md:p-5',
      lg: 'gap-6 rounded-24 p-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

/** 도메인 무관 표면 컨테이너. 배경·radius·elevation을 담고 내용은 children으로 받는다. */
export function Card({ size, className, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ size }), className)} {...props} />;
}
