import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';

import { useProfileForm } from '@/features/profile/model/use-profile-form';
import NicknameForm from '@/features/profile/ui/nickname-form';
import ProfileSelector from '@/features/profile/ui/profile-selector';
import { useGetUser, useOnboardUser } from '@/shared/api/@generated/user-api/user-api';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';

export const Route = createFileRoute('/_authenticated/_onboarding/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { data: user, isPending: isUserPending } = useGetUser();

  const { canSubmit, colorIndex, setColorIndex, handleNicknameChange } = useProfileForm();

  const { mutate, isPending } = useOnboardUser({
    mutation: {
      onSuccess: () => {
        navigate({ to: '/success' });
      },
    },
  });

  if (isUserPending) return null;

  if (user) {
    return <Navigate to={'/main'} />;
  }

  const handleSubmit = (nickname: string) => {
    mutate({
      data: { nickname, profilePhotoNumber: colorIndex + 1 },
    });
  };

  return (
    <div
      className={cn(
        'flex-1 flex flex-col justify-center relative',
        'md:flex-0 md:max-w-[630px] md:w-full md:p-8 md:rounded-xl',
        'md:bg-gradient-to-tl to-white/25 from-white/10 md:to-100%  md:backdrop-blur-xl md:drop-shadow-[0_4px_32px_0,rgba(0,0,0,2.4)]',
        'after:p-px after:pointer-events-none after:absolute after:inset-0 after:rounded-xl ',
        'after:bg-linear-to-l after:from-white/30 after:via-white/20 after:to-white/30',
        'after:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:[mask-origin:content-box,border-box] after:[mask-clip:content-box,border-box] after:mask-exclude',
      )}
    >
      <div className="flex-1 flex flex-col justify-center md:gap-2.5 gap-6 md:max-w-[325px] md:w-full md:min-h-100 md:mx-auto md:mb-10">
        <ProfileSelector
          colorIndex={colorIndex}
          onChange={setColorIndex}
          className="justify-between "
        />
        <NicknameForm
          formId="onboarding-nickname-form"
          onValidityChange={handleNicknameChange}
          onSubmit={handleSubmit}
        />
      </div>

      <Button
        type="submit"
        form="onboarding-nickname-form"
        disabled={!canSubmit}
        loading={isPending}
        className="md:h-[54px]"
      >
        다음
      </Button>
    </div>
  );
}
