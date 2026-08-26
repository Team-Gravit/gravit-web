import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useGetUser } from '@/shared/api/@generated/user-api/user-api';
import CelebrateMascot from '@/shared/assets/_images/mascot-celebrate.png';
import EndMascot from '@/shared/assets/_images/mascot-end.png';
import { cn } from '@/shared/lib/cn';
import { LinkButton } from '@/shared/ui/button/link-button';
export const Route = createFileRoute('/_authenticated/_onboarding/success')({
  component: SuccessPage,
});

function SuccessPage() {
  const { data: user, isPending: isUserPending } = useGetUser();

  if (isUserPending) return null;

  if (!user) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div
      className={cn(
        'flex-1 flex flex-col justify-center relative',
        'md:flex-0 md:max-w-[630px] md:w-full md:p-8 md:rounded-xl',
        'md:bg-gradient-to-tl to-white/25 from-white/10 md:to-100%  md:backdrop-blur-xl md:drop-shadow-[0_4px_32px_0,rgba(0,0,0,2.4)]',
        'glass-morphism-border after:rounded-xl',
      )}
    >
      <div className="flex flex-col justify-center items-center flex-1 md:min-h-100">
        <div className="mb-10 text-center md:mb-4">
          <h3 className="text-heading1 text-text-1 mb-1 md:text-title3 md:text-text-1-w md:mb-4">
            계정 생성 완료!
          </h3>
          <span className="text-label2 text-text-4 md:text-body1-normal md:text-text-2-w">
            그래빗의 일원이 된 걸 환영해요!
          </span>
        </div>
        <picture>
          <source media="(max-width: 768px)" srcSet={CelebrateMascot} />
          <img src={EndMascot} className="w-52.5 md:w-39 mr-auto md:mx-auto mb-5" />
        </picture>
      </div>
      <LinkButton to="/main" className="h-12">
        홈으로
      </LinkButton>
    </div>
  );
}
