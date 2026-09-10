import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

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
  ...props
}: SocialLoginButtonProps) {
  const { mutate: startOauthLogin } = useOauthLogin();

  const handleClick = () => {
    startOauthLogin(provider);
  };

  return (
    <button
      type="button"
      data-slot="social-login-button"
      data-provider={provider}
      onClick={handleClick}
      className={cn(socialLoginButtonVariants({ provider, size }), className)}
      {...props}
    >
      <ProviderLogo
        provider={provider}
        className={cn(PROVIDER_LOGO_CLASS, size === 'narrow' && 'absolute left-3.5')}
      />
      <span>{LOGIN_PROVIDER_LABELS[provider]}</span>
    </button>
  );
}
