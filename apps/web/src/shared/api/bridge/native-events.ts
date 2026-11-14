import type { BridgeEventPayload, BridgeEventType } from '@repo/bridge-protocol';

import { onNativeEvent } from './native-message-channel';

/**
 * 네이티브가 요청 없이 보낸 이벤트를 구독한다. 반환한 함수로 구독을 해제한다.
 * 이벤트 종류는 `BridgeEvents`에 등록한다.
 */
export function subscribeNativeEvent<T extends BridgeEventType>(
  type: T,
  listener: (payload: BridgeEventPayload<T>) => void,
): () => void {
  return onNativeEvent((event) => {
    if (event.type === type) {
      listener(event.payload as BridgeEventPayload<T>);
    }
  });
}
