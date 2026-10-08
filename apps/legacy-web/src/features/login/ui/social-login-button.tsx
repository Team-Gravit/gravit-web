import { useOauthLogin } from '@/entities/login/model/useOauthLogin';
import { socialLoginButtonVariants } from '@/shared/ui/button/button.variants';

type SocialLoginProvider = 'kakao' | 'google' | 'naver';

interface SocialLoginButtonProps {
  logoSrc: string;
  provider: SocialLoginProvider;
}

const getSocialLoginText = (provider: SocialLoginProvider) => {
  switch (provider) {
    case 'google':
      return 'Google로 시작하기';
    case 'kakao':
      return '카카오로 시작하기';
    case 'naver':
      return '네이버로 시작하기';
  }
};

function SocialLoginButton({ logoSrc, provider }: SocialLoginButtonProps) {
  const { mutate } = useOauthLogin();

  return (
    <button
      onClick={() => mutate(provider)}
      className={socialLoginButtonVariants({ variant: provider })}
    >
      <img
        src={logoSrc}
        alt={provider}
        className="absolute left-3 top-1/2 -translate-y-1/2 size-5"
      />
      <span>{getSocialLoginText(provider)}</span>
    </button>
  );
}

export default SocialLoginButton;
