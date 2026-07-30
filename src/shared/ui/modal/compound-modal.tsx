import { createContext, useCallback, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';

import X from '@/shared/assets/icons/buttons/x.svg?react';
import { cn } from '@/shared/lib/cn';

// TODO : 기존 모달 삭제 예정, 해당 모달이 common

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal 컴포넌트 내부에서만 사용할 수 있습니다');
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div
        role="dialog"
        aria-modal
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'flex max-h-[80vh] w-full max-w-[630px] flex-col rounded-xl bg-bg-1',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

interface ModalHeaderProps {
  title: string;
  id?: string;
}

function ModalHeader({ title, id }: ModalHeaderProps) {
  const { onClose } = useModalContext();
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-divider-1 px-6 py-5">
      <h2 id={id} className="text-body1-normal text-text-4">
        {title}
      </h2>
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="flex size-6 items-center justify-center p-1.5"
      >
        <X />
      </button>
    </div>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn('overflow-y-auto py-4 scrollbar-hide', className)}>{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('shrink-0 p-8', className)}>{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
