import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';

import celebrateMascot from './assets/mascot-celebrate.png';

export function OnboardingSuccessPageNarrow() {
  return (
    <div className="flex min-h-svh flex-col bg-white px-4 pt-5 pb-10">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-heading1 text-text-1">계정 생성 완료!</h1>
        <p className="mt-1 text-label2 text-text-4">그래빗의 일원이 된 걸 환영해요!</p>
        <img src={celebrateMascot} alt="" className="mt-10 w-52.5" />
      </div>

      <Button asChild size="cta">
        <Link to="/main">홈으로</Link>
      </Button>
    </div>
  );
}
