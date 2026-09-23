import { useToastStore, type ToastOptions } from './toast-store';

/**
 * 단일 토스트를 띄운다. 컴포넌트 밖(예: mutation 콜백)에서도 호출할 수 있다.
 * 새 호출은 기존 토스트를 대체한다.
 */
export function toast(message: string, options?: ToastOptions) {
  useToastStore.getState().show(message, options);
}
