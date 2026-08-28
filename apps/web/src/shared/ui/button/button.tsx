import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/spinner';

const buttonVariants = cva(
  [
    // 레이아웃
    'group/button relative inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap',

    // 모양
    'rounded-8 border border-transparent bg-clip-padding',

    // 상호작용·모션
    // Tailwind preflight 는 button 에 cursor 를 지정하지 않아 브라우저 기본값(화살표)이 된다.
    'cursor-pointer select-none transition-[background-color,border-color,color,box-shadow]',
    'active:not-aria-[haspopup]:translate-y-px',

    // 포커스
    'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',

    // 비활성
    'disabled:pointer-events-none',

    // 폼 검증 에러
    'aria-invalid:border-semantic-error aria-invalid:ring-3 aria-invalid:ring-semantic-error/20',

    // 크기가 지정되지 않은 날 SVG 에만 기본 크기를 준다.
    // data-slot="icon" 을 가진 Icon 은 자신의 size prop 을 유지한다.
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([data-slot='icon']):not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-cta text-cta-text',
          'hover:bg-cta-hover active:bg-cta-hover',
          'disabled:bg-cta-disabled',
        ],
        secondary: [
          'bg-cta-secondary-default text-cta-secondary-text',
          'hover:bg-cta-secondary-hover active:bg-cta-secondary-hover',
          'disabled:bg-cta-disabled',
        ],
        'stroke-default': [
          'border-main bg-bg-1 text-main',
          'hover:bg-purple-100 active:bg-purple-100',
          'disabled:border-divider-1 disabled:text-text-4',
        ],
        'stroke-secondary': [
          'border-divider-1 bg-bg-1 text-text-2',
          'hover:bg-bg-2 active:bg-bg-2',
          'disabled:border-divider-1 disabled:text-text-4',
        ],
        ghost: [
          'border-transparent bg-transparent text-text-2',
          'hover:bg-bg-2 active:bg-bg-2',
          'disabled:text-text-4',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * 브레이크포인트마다 다르게 지정할 수 있는 크기.
 * `cta` 는 자체적으로 반응형을 포함하므로 조합 대상에서 제외한다.
 */
type ResponsiveSize = 'sm' | 'md' | 'lg' | 'icon';
type ButtonSize = ResponsiveSize | 'cta';
type SizeProp = ButtonSize | { base: ResponsiveSize; md: ResponsiveSize };

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-label1',
  md: 'h-11 px-5 text-body2-normal',
  lg: 'h-12 px-6 text-body1-normal',
  icon: 'size-10 p-0',
  // block CTA. figma 기준 모바일·데스크톱 크기가 한 쌍으로 고정되어 있어 값에 포함한다.
  // 너비를 채우는 유일한 크기이므로 w-full 도 함께 갖는다.
  // 다른 크기에서 너비를 채워야 하면 className 으로 지정한다.
  cta: 'h-12 w-full px-5 text-headline2 md:h-[54px]',
};

// Tailwind 는 리터럴 클래스만 스캔하므로 md: 접두사를 런타임에 붙일 수 없다.
// 반응형 조합을 위해 같은 스케일을 md: 접두사로 한 벌 더 둔다. 값 변경 시 위 표와 함께 수정한다.
const SIZE_CLASS_MD: Record<ResponsiveSize, string> = {
  sm: 'md:h-9 md:px-4 md:text-label1',
  md: 'md:h-11 md:px-5 md:text-body2-normal',
  lg: 'md:h-12 md:px-6 md:text-body1-normal',
  icon: 'md:size-10 md:p-0',
};

function resolveSize(size: SizeProp) {
  if (typeof size === 'string') return SIZE_CLASS[size];
  return cn(SIZE_CLASS[size.base], SIZE_CLASS_MD[size.md]);
}

type ButtonBaseProps = Omit<React.ComponentProps<'button'>, 'children'> &
  Omit<VariantProps<typeof buttonVariants>, 'size'> & {
    children?: React.ReactNode;
    /** 버튼의 크기. 브레이크포인트마다 다르게 주려면 `{ base, md }` 형태를 사용합니다. */
    size?: SizeProp;
    /** 레이블 앞에 붙는 아이콘. 배치와 여백은 버튼이 처리합니다. */
    startIcon?: React.ReactNode;
    /** 레이블 뒤에 붙는 아이콘. 배치와 여백은 버튼이 처리합니다. */
    endIcon?: React.ReactNode;
  };

export type ButtonProps = ButtonBaseProps & {
  /** 버튼 대신 자식 엘리먼트로 렌더합니다. 링크를 버튼 모양으로 쓸 때 사용합니다. */
  asChild?: boolean;
  /** 진행 중인 작업이 있는 상태. 중복 실행을 막고 진행 상태를 알립니다. */
  isLoading?: boolean;
};

function Button({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  isLoading = false,
  startIcon,
  endIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const blocked = disabled || isLoading;

  // asChild 로 렌더된 <a> 등에는 disabled 가 유효하지 않다.
  // 그 경우 aria-disabled 와 pointer-events 차단으로 같은 효과를 낸다.
  const blockingProps = asChild
    ? { 'aria-disabled': blocked || undefined }
    : { disabled: blocked };

  const content = (
    <>
      {startIcon}
      {children}
      {endIcon}
    </>
  );

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? 'default'}
      data-loading={isLoading || undefined}
      aria-busy={isLoading || undefined}
      {...blockingProps}
      className={cn(
        buttonVariants({ variant }),
        resolveSize(size),
        startIcon && 'pl-4',
        endIcon && 'pr-4',
        asChild && blocked && 'pointer-events-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          {/* 레이블을 자리만 남겨 로딩 전환 시 버튼 폭이 변하지 않게 한다. */}
          <span className="invisible inline-flex items-center gap-1.5">{content}</span>
          {/* 색은 Spinner 가 currentColor 로 상속한다. 버튼이 aria-busy 로 알리므로 스피너는 침묵시킨다. */}
          <Spinner
            size="sm"
            label={null}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      ) : (
        content
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
