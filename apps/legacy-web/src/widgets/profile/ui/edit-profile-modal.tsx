import { useProfileForm } from '@/features/profile/model/use-profile-form';
import useUpdateProfileMutation from '@/features/profile/model/use-update-profile-mutation';
import NicknameForm from '@/features/profile/ui/nickname-form';
import ProfileSelector from '@/features/profile/ui/profile-selector';
import { Button } from '@/shared/ui/button/Button';
import Modal from '@/shared/ui/modal/compound-modal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  profileImageNumber: number;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  nickname,
  profileImageNumber,
}: EditProfileModalProps) {
  const { colorIndex, setColorIndex, canSubmit, handleNicknameChange } = useProfileForm({
    initialColorIndex: profileImageNumber - 1,
    initialNickname: nickname,
  });

  const { mutate } = useUpdateProfileMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (nickname: string) => {
    mutate({
      data: {
        nickname,
        profilePhotoNumber: colorIndex + 1,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="프로필 수정" />
      <Modal.Content className="mb-10 mt-8 py-0">
        <div className="py-9 px-8 space-y-8">
          <ProfileSelector
            onChange={setColorIndex}
            className="justify-between"
            isCompact
            colorIndex={colorIndex}
          />
          <NicknameForm
            onValidityChange={handleNicknameChange}
            formId="edit-profile-form"
            onSubmit={handleSubmit}
            isCompact
            labelClassName="text-heading1"
            inputClassName="bg-white text-headline2"
            initialNickname={nickname}
          />
        </div>
      </Modal.Content>

      <Modal.Footer className="flex items-center gap-4 px-8 pb-8 pt-0">
        <Button
          type="button"
          onClick={onClose}
          variant={'strokeGray'}
          className="w-full md:h-[54px] text-main-2 bg-white"
        >
          돌아가기
        </Button>
        <Button
          disabled={!canSubmit}
          type="submit"
          form="edit-profile-form"
          className="md:h-[54px] w-full"
        >
          수정하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
