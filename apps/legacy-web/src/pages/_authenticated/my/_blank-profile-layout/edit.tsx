import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router';

import { useProfileForm } from '@/features/profile/model/use-profile-form';
import useUpdateProfileMutation from '@/features/profile/model/use-update-profile-mutation';
import NicknameForm from '@/features/profile/ui/nickname-form';
import ProfileSelector from '@/features/profile/ui/profile-selector';
import { useGetMyPageBanner } from '@/shared/api/@generated/mypage-api/mypage-api';
import { Button } from '@/shared/ui/button/Button';

export const Route = createFileRoute('/_authenticated/my/_blank-profile-layout/edit')({
  component: RouteComponent,
  staticData: { pageTitle: '프로필 수정' },
  loader: () => {
    if (window.innerWidth >= 769) throw redirect({ to: '/my' });
  },
});

function RouteComponent() {
  const { data, isPending } = useGetMyPageBanner();

  if (isPending || !data) return null;

  return <EditProfileForm data={data} />;
}

interface EditProfileFormData {
  nickname: string;
  profileImageNumber: number;
}

function EditProfileForm({ data }: { data: EditProfileFormData }) {
  const router = useRouter();
  const navigate = useNavigate();

  const { canSubmit, colorIndex, handleNicknameChange, setColorIndex } = useProfileForm({
    initialColorIndex: data.profileImageNumber - 1,
    initialNickname: data.nickname,
  });

  const { mutate } = useUpdateProfileMutation({
    onSuccess: handleBack,
  });

  function handleBack() {
    if (router.history.canGoBack()) {
      router.history.back();
      return;
    }
    navigate({ to: '/my' });
  }

  function handleSubmit(nickname: string) {
    mutate({ data: { nickname, profilePhotoNumber: colorIndex + 1 } });
  }

  return (
    <section className="flex-1 flex flex-col justify-between p-4">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <ProfileSelector
          isCompact
          className="justify-between"
          onChange={setColorIndex}
          colorIndex={colorIndex}
        />
        <NicknameForm
          formId="edit-profile-form"
          onSubmit={handleSubmit}
          initialNickname={data.nickname}
          onValidityChange={handleNicknameChange}
          isCompact
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleBack}
          type="button"
          variant={'strokeGray'}
          className="w-full h-12 text-main-2 bg-white"
        >
          돌아가기
        </Button>
        <Button
          disabled={!canSubmit}
          type="submit"
          form="edit-profile-form"
          className="h-12 w-full"
        >
          수정하기
        </Button>
      </div>
    </section>
  );
}
