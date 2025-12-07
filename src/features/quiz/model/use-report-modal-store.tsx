import { create } from "zustand";

interface ReportModalState {
	isReportOpen: boolean;
	openReportModal: () => void;
	closeReportModal: () => void;

	isResultOpen: boolean;
	openResultModal: () => void;
	closeResultModal: () => void;
}

export const useReportModalStore = create<ReportModalState>((set) => ({
	isReportOpen: false,
	openReportModal: () => set({ isReportOpen: true }),
	closeReportModal: () => set({ isReportOpen: false }),

	isResultOpen: false,
	openResultModal: () => set({ isResultOpen: true }),
	closeResultModal: () => set({ isResultOpen: false }),
}));
