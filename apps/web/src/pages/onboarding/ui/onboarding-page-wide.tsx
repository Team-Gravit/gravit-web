import { OnboardingForm, type OnboardingFormProps } from '@/features/user-onboarding';
import { SpaceBackground } from '@/shared/ui/layout';
import { GravitLogo } from '@/shared/ui/logo';

import { OnboardingCancelButton } from './onboarding-cancel-button';

export interface OnboardingPageWideProps extends Pick<OnboardingFormProps, 'form'> {
  onCancel: () => void;
}

/**
 * 넓은 화면 온보딩. 우주 배경 위에 반투명 카드를 가운데 놓는다.
 *
 * 「이전」은 시안에 없지만, 온보딩 게이트가 다른 화면을 막으므로 다른 계정으로 로그인할 길로 둔다 (FIX-078).
 * 브라우저 백은 가로채지 않는다 — 백은 「이전 화면」이지 「취소」가 아니라서, 실수로 누른 사용자를
 * 로그아웃시키게 된다.
 */
export function OnboardingPageWide({ form, onCancel }: OnboardingPageWideProps) {
  return (
    <SpaceBackground className="flex flex-col items-center justify-center px-4 py-10 short:py-6">
      {/* 화면을 대표하는 것이 워드마크라 제목이 글자로 보이지 않는다. 이름은 좁은 화면과 맞춘다. */}
      <h1 className="sr-only">로그인</h1>

      <GravitLogo variant="mono" className="h-[90px] w-auto text-text-1-w short:h-16" />
      <p className="mt-4 text-heading2 text-text-1-w">그래빗과 함께 CS 지식을 마스터해요!</p>

      <section
        className="glass-morphism-border relative mt-8 flex w-full max-w-[630px] rounded-12 p-8 backdrop-blur-xl after:rounded-12 short:mt-5 short:p-6"
        style={{
          background:
            'linear-gradient(108.74deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.06) 100%)',
          boxShadow: '0px 4px 32px 0px #00000006',
        }}
      >
        <OnboardingForm
          className="mx-auto min-h-100 w-full"
          form={form}
          secondaryAction={<OnboardingCancelButton onCancel={onCancel} />}
        />
      </section>
    </SpaceBackground>
  );
}
