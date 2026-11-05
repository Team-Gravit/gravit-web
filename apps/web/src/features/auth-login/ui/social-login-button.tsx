import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { isBridgeError, isNativeApp } from '@/shared/api';
import type { LoginResponse } from '@/shared/api/generated/model';
import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from '@/shared/ui/toast';

import { useNativeLogin } from '../api/use-native-login';
import { LOGIN_UNSUPPORTED_MESSAGE } from '../model/login-outcome';
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
  /** 앱 환경에서 네이티브 SDK 로그인이 끝나 세션이 만들어졌다. 이동은 호출부가 정한다. */
  onLoginSuccess?: (response: LoginResponse) => void;
  /**
   * 취소(`CANCELLED`)와 미지원(`UNSUPPORTED`)은 버튼에서 처리한다.
   * 그 밖의 브릿지 오류(`BridgeError`)와 서버 요청 오류를 호출부에 전달한다.
   */
  onLoginError?: (error: unknown) => void;
}

// em 은 자기 자신의 font-size 를 기준으로 한다. 로고에는 font-size 가 없어 버튼에서 물려받으므로
// 높이가 버튼 글자 크기를 따라간다 — size 변형을 추가해도 로고를 따로 손보지 않는다.
const PROVIDER_LOGO_CLASS = 'h-[1em] w-auto shrink-0 object-contain';

// 버튼 레이블이 제공자를 알리므로 로고는 접근성 트리에서 제외한다.
function ProviderLogo({ provider, className }: { provider: LoginProvider; className: string }) {
  if (provider === 'google') {
    return <img src={googleLogo} alt="" className={className} />;
  }

  if (provider === 'kakao') {
    return <KakaoLogo aria-hidden className={className} />;
  }

  return <NaverLogo aria-hidden className={cn(className, 'h-[17px]')} />;
}

/**
 * 선택한 provider 로 로그인을 시작한다.
 *
 * 브라우저에서는 인가 페이지로 이동하고, 앱 환경에서는 브릿지로 네이티브 SDK 로그인을
 * 요청한다. 두 훅을 모두 호출하는 이유: 환경은 문서 수명 동안 바뀌지 않지만 조건부 훅 호출은
 * 훅 규칙 위반이다. 어느 쪽을 쓸지는 클릭 시점에 가른다.
 */
export function SocialLoginButton({
  provider,
  size = 'narrow',
  className,
  disabled,
  onLoginSuccess,
  onLoginError,
  ...props
}: SocialLoginButtonProps) {
  const { mutate: startOauthLogin, isPending: isOauthPending } = useOauthLogin();
  const { mutate: startNativeLogin, isPending: isNativePending } = useNativeLogin();
  const isPending = isOauthPending || isNativePending;

  const handleNativeLoginError = (error: unknown) => {
    // 사용자가 SDK 화면을 닫았다. 실패이지만 알릴 일이 아니다. 버튼만 풀린다.
    if (isBridgeError(error, 'CANCELLED')) {
      return;
    }

    // 이 로그인을 처리하지 못하는 앱이다. 웹 인가 페이지는 Google·네이버가 WebView 에서 막으므로
    // 폴백하지 않고 업데이트를 안내한다.
    if (isBridgeError(error, 'UNSUPPORTED')) {
      toast(LOGIN_UNSUPPORTED_MESSAGE, { position: 'noneTabBottom' });
      return;
    }

    onLoginError?.(error);
  };

  const handleClick = () => {
    if (isNativeApp()) {
      startNativeLogin(provider, {
        // mutation 콜백의 나머지 인자(variables · context)를 prop 계약 밖으로 흘리지 않는다.
        onSuccess: (response) => onLoginSuccess?.(response),
        onError: handleNativeLoginError,
      });
      return;
    }

    startOauthLogin(provider);
  };

  // 웹 경로는 성공하면 window.location.href 로 문서가 전환되므로 pending 이 풀리지 않는다.
  // 즉 이동이 시작된 뒤에도 버튼이 잠긴 채로 남는 것이 의도된 동작이다.
  // 네이티브 경로는 mutation 이 끝나면 풀리고, 이동은 onLoginSuccess 를 받은 호출부가 한다.
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
