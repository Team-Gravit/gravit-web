import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { isBridgeError, isNativeApp } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from '@/shared/ui/toast';

import { useAppleWebLogin } from '../api/use-apple-web-login';
import { useNativeLogin } from '../api/use-native-login';
import { LOGIN_UNSUPPORTED_MESSAGE, type LoginSuccess } from '../model/login-outcome';
import { LOGIN_PROVIDER_LABELS, type LoginProvider } from '../model/login-providers';
import { useOauthLogin } from '../model/use-oauth-login';
import AppleLogo from './assets/apple.svg?react';
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
        // Apple 은 검정 배경에 흰 글자·로고를 쓴다 (로고가 currentColor 라 글자색을 따른다)
        apple: 'bg-black text-white',
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
  /**
   * 앱의 네이티브 SDK 로그인이나 브라우저의 Apple 팝업 로그인이 끝나 세션이 만들어졌다.
   * 이동은 호출부가 정한다. (다른 provider 의 브라우저 로그인은 인가 페이지로 이동해 호출되지 않는다.)
   */
  onLoginSuccess?: (response: LoginSuccess) => void;
  /**
   * 취소(`CANCELLED`)와 미지원(`UNSUPPORTED`)은 버튼에서 처리한다.
   * 그 밖의 브릿지 오류(`BridgeError`)와 서버 요청 오류를 호출부에 전달한다.
   */
  onLoginError?: (error: unknown) => void;
}

// 시안의 로고 자리(20×20)다. 로고마다 가로세로 비율이 달라 긴 쪽이 이 상자에 닿을 때까지만 키워
// 잘리지 않게 한다. SVG 는 viewBox 기본 동작이 같고, 이미지는 object-contain 이 맡는다.
const PROVIDER_LOGO_CLASS = 'size-5 shrink-0 object-contain';

// 버튼 레이블이 제공자를 알리므로 로고는 접근성 트리에서 제외한다.
function ProviderLogo({ provider, className }: { provider: LoginProvider; className: string }) {
  if (provider === 'google') {
    return <img src={googleLogo} alt="" className={className} />;
  }

  if (provider === 'kakao') {
    return <KakaoLogo aria-hidden className={className} />;
  }

  if (provider === 'apple') {
    // apple.svg 는 안쪽 여백이 있고 폭이 좁아 같은 상자에서 작아 보인다. 시안이 없어 눈으로 맞춘 값이다.
    return <AppleLogo aria-hidden className={cn(className, 'size-[22px]')} />;
  }

  // 시안에서 네이버 로고만 다른 로고보다 작다 (17×16).
  return <NaverLogo aria-hidden className={cn(className, 'size-[17px]')} />;
}

/**
 * 선택한 provider 로 로그인을 시작한다.
 *
 * 브라우저에서는 인가 페이지로 이동하고(Apple 은 JS SDK 팝업), 앱 환경에서는 브릿지로 네이티브
 * SDK 로그인을 요청한다. 훅을 모두 호출하는 이유: 환경은 문서 수명 동안 바뀌지 않지만 조건부 훅 호출은
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
  const { mutate: startAppleWebLogin, isPending: isAppleWebPending } = useAppleWebLogin();
  const isPending = isOauthPending || isNativePending || isAppleWebPending;

  // 네이티브 SDK 와 Apple 웹 팝업이 같이 쓴다. 둘 다 세션을 만들고 끝나며 취소를 CANCELLED 로 알린다.
  const handleSdkLoginError = (error: unknown) => {
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
        onError: handleSdkLoginError,
      });
      return;
    }

    if (provider === 'apple') {
      startAppleWebLogin(undefined, {
        onSuccess: (response) => onLoginSuccess?.(response),
        onError: handleSdkLoginError,
      });
      return;
    }

    startOauthLogin(provider, { onError: (error) => onLoginError?.(error) });
  };

  // 웹 경로는 성공하면 window.location.href 로 문서가 전환되므로 pending 이 풀리지 않는다.
  // 즉 이동이 시작된 뒤에도 버튼이 잠긴 채로 남는 것이 의도된 동작이다.
  // 네이티브 경로와 Apple 웹 팝업은 mutation 이 끝나면 풀리고, 이동은 onLoginSuccess 를 받은 호출부가 한다.
  const logo = <ProviderLogo provider={provider} className={PROVIDER_LOGO_CLASS} />;
  const content = (
    <>
      {size === 'narrow' ? (
        // 로고 크기가 달라 왼쪽 끝을 맞추면 버튼끼리 중심선이 어긋난다. 시안의 40px 자리 가운데에 둔다.
        <span className="absolute left-1 flex size-10 items-center justify-center">{logo}</span>
      ) : (
        logo
      )}
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
