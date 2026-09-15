import type { ComponentProps } from 'react';
import { createLink, type LinkComponent } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';

function CardLinkAnchor({ className, ...props }: ComponentProps<'a'>) {
  return (
    <a
      data-slot="card-link"
      className={cn(
        'text-label2 text-text-4 underline underline-offset-2 md:text-body1-normal',
        className,
      )}
      {...props}
    />
  );
}

const CardLinkBase = createLink(CardLinkAnchor);

export type CardLinkProps = ComponentProps<typeof CardLinkBase>;

/**
 * 카드 헤더에 사용하는 라우터 링크.
 * `createLink`로 앵커 스타일을 재사용하면서 `to`와 `params`의 라우트 타입을 유지한다.
 */
export const CardLink: LinkComponent<typeof CardLinkAnchor> = (props) => (
  <CardLinkBase {...props} />
);
