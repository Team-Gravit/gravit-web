import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/spinner';

import { LOGIN_PROVIDER_LABELS, type LoginProvider } from '../model/login-providers';
import { useOauthLogin } from '../model/use-oauth-login';
import googleLogo from './assets/google-logo.png';
import KakaoLogo from './assets/kakao-logo.svg?react';
import NaverLogo from './assets/naver-logo.svg?react';

const socialLoginButtonVariants = cva(
  [
    // 레이아웃
    'relative flex w-full items-center justify-center',

    // 상호작용
    'cursor-pointer select-none transition-colors',
    // 색은 바꾸지 않는다. 시안에 로딩·비활성 상태 프레임이 없어 새로 만들지 않는다.
    'disabled:cursor-default',

    // 포커스
    'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
  ],
  {
    variants: {
      provider: {
        google: 'border border-divider-1 bg-[#FFF] text-[#1F1F1F]',
        // 카카오·네이버 색은 각 사의 브랜드 색이므로 tokens.css 로 올리지 않고 이 버튼 안에서만 사용한다
        kakao: 'bg-[#FFE500] text-[rgba(0,0,0,0.85)]',
        naver: 'bg-[#03A94D] text-white',
      },
      size: {
        narrow: 'h-12 text-body2-reading rounded-8',
        wide: 'h-15 gap-3 text-heading2 rounded-10',
      },
    },
    defaultVariants: {
      size: 'narrow',
    },
  },
);

type SocialLoginButtonSize = NonNullable<VariantProps<typeof socialLoginButtonVariants>['size']>;

export interface SocialLoginButtonProps
  extends Omit<ComponentProps<'button'>, 'children' | 'onClick'> {
  provider: LoginProvider;
  size?: SocialLoginButtonSize;
}

// em 은 자기 자신의 font-size 를 기준으로 한다. 로고에는 font-size 가 없어 버튼에서 물려받으므로
// 높이가 버튼 글자 크기를 따라간다 — size 변형을 추가해도 로고를 따로 손보지 않는다.
const PROVIDER_LOGO_CLASS = 'h-[1em] w-auto shrink-0 object-contain';

/** provider 로고
 * - 옆에 있는 레이블이 같은 내용을 말하므로 aria-hidden 적용. */
function ProviderLogo({ provider, className }: { provider: LoginProvider; className: string }) {
  if (provider === 'google') {
    return <img src={googleLogo} alt="" className={className} />;
  }

  if (provider === 'kakao') {
    return <KakaoLogo aria-hidden className={className} />;
  }

  return <NaverLogo aria-hidden className={cn(className, 'h-[17px]')} />;
}

/** 선택한 provider 의 인가 페이지로 이동을 시작한다. */
export function SocialLoginButton({
  provider,
  size = 'narrow',
  className,
  disabled,
  ...props
}: SocialLoginButtonProps) {
  const { mutate: startOauthLogin, isPending } = useOauthLogin();

  const handleClick = () => {
    startOauthLogin(provider);
  };

  // 성공하면 window.location.href 로 문서가 전환되므로 pending 이 풀리지 않는다.
  // 즉 이동이 시작된 뒤에도 버튼이 잠긴 채로 남는 것이 의도된 동작이다.
  const content = (
    <>
      <ProviderLogo
        provider={provider}
        className={cn(PROVIDER_LOGO_CLASS, size === 'narrow' && 'absolute left-3.5')}
      />
      <span>{LOGIN_PROVIDER_LABELS[provider]}</span>
    </>
  );

  return (
    <button
      type="button"
      data-slot="social-login-button"
      data-provider={provider}
      data-loading={isPending || undefined}
      aria-busy={isPending || undefined}
      disabled={disabled || isPending}
      onClick={handleClick}
      className={cn(socialLoginButtonVariants({ provider, size }), className)}
      {...props}
    >
      {isPending ? (
        <>
          {/*
            레이블 자리를 남겨 로딩 전환 시 버튼 크기가 변하지 않게 한다 (Button 과 같은 방식).
            contents 를 쓰는 이유: 로고는 narrow 에서 버튼 기준으로 absolute 배치되고 wide 에서는
            버튼의 flex gap 을 받는다. 래퍼가 자체 박스를 가지면 두 배치가 모두 깨진다.
          */}
          <span className="invisible contents">{content}</span>
          {/* 버튼이 aria-busy 로 알리므로 스피너는 침묵시킨다. 색은 currentColor 를 상속한다. */}
          <Spinner
            size="sm"
            label={null}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      ) : (
        content
      )}
    </button>
  );
}
