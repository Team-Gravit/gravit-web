import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import NicknameForm from '@/features/onboarding/ui/nickname-form';
import ProfileSelector from '@/features/onboarding/ui/profile-selector';
import { useOnboardUser } from '@/shared/api/@generated/user-api/user-api';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';

export const Route = createFileRoute('/_authenticated/_onboarding/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const { mutate, isPending } = useOnboardUser({
    mutation: {
      onSuccess: () => {
        navigate({ to: '/success' });
      },
    },
  });

  const formHelperText = (
    <div className="text-caption1 md:text-label1 text-text-4 space-y-1 md:text-text-1-w">
      <p>*글자수 2~8자</p>
      <p>*공백, 특수문자 제외</p>
    </div>
  );

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
      <div className="flex-1 flex flex-col justify-center md:gap-2.5 gap-6 md:max-w-[325px] md:min-h-100 md:mx-auto md:mb-10">
        <ProfileSelector onChange={setColorIndex} />
        <NicknameForm
          formId="onboarding-nickname-form"
          helperText={formHelperText}
          onValidityChange={setCanSubmit}
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
