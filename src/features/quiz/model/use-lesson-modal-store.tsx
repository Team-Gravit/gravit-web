import { create } from 'zustand';

type LessonModalType = 'report' | 'result' | 'quit' | null;

interface LessonModalState {
  lessonModalType: LessonModalType;
  openLessonModal: (type: LessonModalType) => void;
  closeLessonModal: () => void;
}

export const useLessonModalStore = create<LessonModalState>((set) => ({
  lessonModalType: null,
  openLessonModal: (type) => {
    set({ lessonModalType: type });
  },
  closeLessonModal: () => {
    set({ lessonModalType: null });
  },
}));

export const useLessonModal = (type: LessonModalType) => {
  const { lessonModalType, openLessonModal, closeLessonModal } = useLessonModalStore();

  return {
    isOpen: lessonModalType === type,
    openModal: () => openLessonModal(type),
    closeModal: () => closeLessonModal(),
  };
};

export const useIsAnyModalOpen = () => {
  const lessonModalType = useLessonModalStore((state) => state.lessonModalType);

  return lessonModalType !== null;
};
