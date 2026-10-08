import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useUserInfo } from '@/entities/sidebar/api/useUserInfo';
import NicknameForm from '@/features/profile/ui/nickname-form';
import ProfileSelector from '@/features/profile/ui/profile-selector';
import { usePatchUserProfile } from '@/features/user/update-user/api/patchUserProfile';
import Form from '@/shared/ui/form/Form';

export const Route = createFileRoute(
  '/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/edit',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { data: user, isLoading } = useUserInfo();

  const { mutate } = usePatchUserProfile();

  if (isLoading || !user) {
    return <div className="w-full h-full flex items-center justify-center">로딩중...</div>;
  }

  return (
    <EditForm
      user={user}
      onCancel={() => navigate({ to: '/user' })}
      onSubmit={(nickname, colorIndex) => {
        mutate(
          { nickname, profilePhotoNumber: colorIndex + 1 },
          {
            onSuccess: () => navigate({ to: '/user' }),
            onError: () => alert('프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요.'),
          },
        );
      }}
    />
  );
}

function EditForm({
  user,
  onCancel,
  onSubmit,
}: {
  user: { nickname: string; profileImgNumber: number };
  onCancel: () => void;
  onSubmit: (nickname: string, colorIndex: number) => void;
}) {
  const [colorIndex, setColorIndex] = useState(user.profileImgNumber - 1);
  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#f2f2f2] p-8">
      <Form className="w-full h-[640px] px-48 py-32 flex flex-col relative">
        <ProfileSelector colorIndex={colorIndex} onChange={setColorIndex} />

        <div className="flex-1 w-full min-h-[150px] mt-6 px-6">
          <NicknameForm
            formId="edit-nickname-form"
            initialNickname={user.nickname}
            placeholder={user.nickname}
            onValidityChange={setCanSubmit}
            onSubmit={(trimmedNickname) => onSubmit(trimmedNickname, colorIndex)}
          />
        </div>

        <div className="flex flex-row w-full px-[220px] gap-4 absolute bottom-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-14 text-white py-2 rounded-xl text-lg font-semibold transition bg-[#A8A8A8]"
          >
            돌아가기
          </button>

          <button
            type="submit"
            form="edit-nickname-form"
            disabled={!canSubmit}
            className="flex-1 h-14 text-white py-2 rounded-xl text-lg font-semibold transition bg-[#8100B3] disabled:opacity-50"
          >
            수정하기
          </button>
        </div>
      </Form>
    </div>
  );
}
