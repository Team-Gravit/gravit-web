import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  /** 초기 세션 확인이 끝났는지. false면 토큰이 없다고 단정하지 않으며, true도 토큰의 유효성을 보장하지 않는다. */
  isRestored: boolean;
  setToken: (accessToken: string) => void;
  clearToken: () => void;
  finishRestore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isRestored: false,
  // 토큰이 정해졌다면 복원 절차도 끝난 것이다.
  setToken: (accessToken) => set({ accessToken, isRestored: true }),
  clearToken: () => set({ accessToken: null, isRestored: true }),
  finishRestore: () => set({ isRestored: true }),
}));
