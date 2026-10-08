import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { SpaceBackground } from '@/shared/ui/layout';
import { GravitLogo } from '@/shared/ui/logo';

import endMascot from './assets/mascot-end.png';

export function OnboardingSuccessPageWide() {
  return (
    <SpaceBackground className="flex flex-col items-center justify-center px-4 py-10 short:py-6">
      <h1 className="sr-only">로그인</h1>

      <GravitLogo variant="mono" className="h-[90px] w-auto text-text-1-w short:h-16" />
      <p className="mt-4 text-heading2 text-text-1-w">그래빗과 함께 CS 지식을 마스터해요!</p>

      <section
        className="glass-morphism-border relative mt-8 flex w-full max-w-[630px] flex-col rounded-12 p-8 backdrop-blur-xl after:rounded-12 short:mt-5 short:p-6"
        style={{
          background:
            'linear-gradient(108.74deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.06) 100%)',
          boxShadow: '0px 4px 32px 0px #00000006',
        }}
      >
        <div className="mx-auto flex min-h-100 w-full max-w-[325px] flex-1 flex-col items-center justify-center short:min-h-75">
          <h2 className="text-title3 text-text-1-w">계정 생성 완료!</h2>
          <p className="mt-4 text-body1-normal text-text-2-w">그래빗의 일원이 된 걸 환영해요!</p>
          <img src={endMascot} alt="" className="mt-4 w-39" />
        </div>

        <Button asChild size="cta" className="mt-6">
          <Link to="/main">홈으로</Link>
        </Button>
      </section>
    </SpaceBackground>
  );
}
