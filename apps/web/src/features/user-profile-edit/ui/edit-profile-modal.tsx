import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { Modal, ModalTitle } from '@/shared/ui/modal';

import { useProfileEditForm } from '../model/use-profile-edit-form';

import { ProfileEditForm } from './profile-edit-form';

export interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 현재 닉네임. */
  nickname: string;
  /** 현재 프로필 색상 번호(1~19). */
  profileImageNumber: number;
}

/** 데스크톱 프로필 수정 모달. 모바일은 `/my/edit` 전체화면 페이지를 쓴다. */
export function EditProfileModal({
  open,
  onOpenChange,
  nickname,
  profileImageNumber,
}: EditProfileModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-[630px] p-0">
      {/* 본문은 열렸을 때만 마운트되므로(Radix Portal) 열 때마다 폼 상태가 현재 값으로 초기화된다. */}
      <ModalBody
        nickname={nickname}
        profileImageNumber={profileImageNumber}
        onClose={() => onOpenChange(false)}
      />
    </Modal>
  );
}

interface ModalBodyProps {
  nickname: string;
  profileImageNumber: number;
  onClose: () => void;
}

function ModalBody({ nickname, profileImageNumber, onClose }: ModalBodyProps) {
  const form = useProfileEditForm({
    initialNickname: nickname,
    initialColorNumber: profileImageNumber,
    onSuccess: onClose,
  });

  return (
    <>
      <header className="flex items-center justify-between border-b border-divider-1 px-6 py-3">
        <ModalTitle className="text-body1-normal text-text-4">프로필 수정</ModalTitle>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={cn(
            'inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-1',
            'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
          )}
        >
          <Icon name="close-md" />
        </button>
      </header>

      <ProfileEditForm form={form} onCancel={onClose} className="px-8 pt-8 pb-8" />
    </>
  );
}
