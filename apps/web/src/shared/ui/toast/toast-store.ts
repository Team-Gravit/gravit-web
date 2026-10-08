import { create } from 'zustand';

export type ToastPosition = 'top' | 'bottom';

export interface ToastOptions {
  /** 화면에서 토스트가 뜰 위치. 기본은 하단. */
  position?: ToastPosition;
  /** 자동으로 사라지기까지의 시간(ms). */
  duration?: number;
}

interface ActiveToast {
  /** 같은 메시지를 다시 띄워도 애니메이션·타이머가 재시작되도록 매 호출 새 id 를 부여한다. */
  id: number;
  message: string;
  position: ToastPosition;
  duration: number;
}

interface ToastState {
  toast: ActiveToast | null;
  show: (message: string, options?: ToastOptions) => void;
  dismiss: () => void;
}

const DEFAULT_DURATION_MS = 3000;

let nextId = 0;

/** 단일 토스트 상태. 새 show 호출은 기존 토스트를 대체한다(다중 스택 없음). */
export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (message, options) =>
    set({
      toast: {
        id: (nextId += 1),
        message,
        position: options?.position ?? 'bottom',
        duration: options?.duration ?? DEFAULT_DURATION_MS,
      },
    }),
  dismiss: () => set({ toast: null }),
}));
