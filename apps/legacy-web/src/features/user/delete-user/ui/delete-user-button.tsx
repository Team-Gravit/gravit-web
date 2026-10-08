import { useRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { ConfirmModal, type ConfirmModalRef } from '@/shared/ui/modal/ConfirmModal';
import {
  type SuccessModalRef,
  SuccessNotificationModal,
} from '@/shared/ui/modal/SuccessNotificationModal';

import { useSendWithdrawEmail } from '../api/useWithdraw';

interface DeleteUserButtonProps {
  className?: string;
}

function DeleteUserButton({ className }: DeleteUserButtonProps) {
  const withdrawModalRef = useRef<ConfirmModalRef>(null);
  const sendWithdrawEmail = useSendWithdrawEmail();
  const successModalRef = useRef<SuccessModalRef>(null);

  const handleOpenDrawModal = () => {
    if (!withdrawModalRef.current) return;

    withdrawModalRef.current.open();
  };

  // TODO : 하드코딩 되어 있는 컬러 추후 컬러 토큰으로 수정

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDrawModal}
        className={cn('text-[#EB3D32]', className)}
      >
        탈퇴하기
      </button>
      <ConfirmModal
        ref={withdrawModalRef}
        title={['정말로', '탈퇴하실건가요?']}
        description={[
          '계정을 삭제하면 저장된 모든 데이터가 사라져요.',
          '정말로 계정을 삭제하실건가요?',
        ]}
        confirmText="탈퇴하기"
        cancelText="돌아가기"
        onConfirm={() => {
          /** 메일 보내기 */
          sendWithdrawEmail.mutate();
          successModalRef.current?.open();
        }}
        onCancel={() => {}}
      />
      <SuccessNotificationModal
        title={['탈퇴하신다니 정말 아쉬워요.']}
        description={[
          '가입하신 이메일로 메일을',
          '전송해드렸으니 메일을 확인해 주시고',
          '절차를 따라주세요.',
        ]}
        ref={successModalRef}
        onSubmit={() => {}}
      />
    </>
  );
}

export default DeleteUserButton;
