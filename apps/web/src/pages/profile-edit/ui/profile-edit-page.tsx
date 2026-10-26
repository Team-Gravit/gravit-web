import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router';

import { useMyPageBanner } from '@/entities/user';
import { ProfileEditForm, useProfileEditForm } from '@/features/user-profile-edit';
import { PageTitleBar } from '@/widgets/page-title-bar';

/**
 * 모바일 전체화면 프로필 수정 페이지. 데스크톱은 마이페이지에서 모달로 연다.
 * 초기값은 마이페이지 배너에서 읽는다. 아직 없으면 아무것도 그리지 않는다(배너가 곧 도착).
 */
export function ProfileEditPage() {
  const { data, isPending } = useMyPageBanner();

  if (isPending || !data) {
    return null;
  }

  return <ProfileEditView nickname={data.nickname} profileImageNumber={data.profileImageNumber} />;
}

interface ProfileEditViewProps {
  nickname: string;
  profileImageNumber: number;
}

function ProfileEditView({ nickname, profileImageNumber }: ProfileEditViewProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const navigate = useNavigate();

  const goBack = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }
    navigate({ to: '/my' });
  };

  const form = useProfileEditForm({
    initialNickname: nickname,
    initialColorNumber: profileImageNumber,
    onSuccess: goBack,
  });

  return (
    <div className="flex h-dvh flex-col bg-bg-0">
      <PageTitleBar title="프로필 수정" backTo={{ to: '/my' }} />
      <ProfileEditForm form={form} onCancel={goBack} className="flex-1 p-4 pb-safe-4" />
    </div>
  );
}
