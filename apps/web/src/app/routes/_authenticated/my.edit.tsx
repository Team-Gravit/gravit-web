import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { ProfileEditPage } from '@/pages/profile-edit';

export const Route = createFileRoute('/_authenticated/my/edit')({
  component: ProfileEditRoute,
});

function ProfileEditRoute() {
  const navigate = useNavigate();
  const isWide = useIsWideViewport();

  // 데스크톱은 마이페이지에서 모달로 수정하므로, 전체 화면 /my/edit 로 오면 마이페이지로 되돌린다.
  useEffect(() => {
    if (isWide) {
      navigate({ to: '/my', replace: true });
    }
  }, [isWide, navigate]);

  if (isWide) {
    return null;
  }

  return <ProfileEditPage />;
}
