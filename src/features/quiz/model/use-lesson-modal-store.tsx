import { create } from "zustand";

interface LessonModalState {
	isReportOpen: boolean;
	openReportModal: () => void;
	closeReportModal: () => void;

	isResultOpen: boolean;
	openResultModal: () => void;
	closeResultModal: () => void;

	isQuitOpen: boolean;
	openQuitModal: () => void;
	closeQuitModal: () => void;
}

export const useLessonModalStore = create<LessonModalState>((set) => ({
	isReportOpen: false,
	openReportModal: () => set({ isReportOpen: true }),
	closeReportModal: () => set({ isReportOpen: false }),

	isResultOpen: false,
	openResultModal: () => set({ isResultOpen: true }),
	closeResultModal: () => set({ isResultOpen: false }),

	isQuitOpen: false,
	openQuitModal: () => set({ isQuitOpen: true }),
	closeQuitModal: () => set({ isQuitOpen: false }),
}));

export const useIsAnyModalOpen = () => {
	return useLessonModalStore(
		(state) => state.isReportOpen || state.isResultOpen || state.isQuitOpen,
	);
};
