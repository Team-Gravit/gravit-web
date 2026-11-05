import { parseBridgeMessage, type BridgeEvent, type BridgeResponse } from '@repo/bridge-protocol';

type ResponseListener = (response: BridgeResponse) => void;
type EventListener = (event: BridgeEvent) => void;

const responseListeners = new Set<ResponseListener>();
const eventListeners = new Set<EventListener>();
let isListening = false;

/**
 * `message` 이벤트를 브릿지 봉투로 해석해 응답·이벤트 리스너에 전달한다.
 * 응답에 SDK 토큰이 실릴 수 있으므로 잘못된 메시지의 원문은 로그에 남기지 않는다.
 */
function handleMessage(event: Event) {
  const { data } = event as MessageEvent<unknown>;

  // window 에는 다른 message 이벤트도 들어오므로 문자열만 브릿지 파서에 넘긴다.
  if (typeof data !== 'string') {
    return;
  }

  const message = parseBridgeMessage(data);

  if (!message) {
    console.warn('[bridge] 봉투 형식이 아닌 메시지를 무시한다');
    return;
  }

  if (message.kind === 'response') {
    responseListeners.forEach((listener) => listener(message));
    return;
  }

  if (message.kind === 'event') {
    eventListeners.forEach((listener) => listener(message));
    return;
  }

  console.warn(`[bridge] 네이티브가 보낸 request 는 지원하지 않는다: type=${message.type}`);
}

// iOS 는 window, Android 는 document 를 대상으로 message 이벤트를 보낸다.
// 둘 다 window 를 지나가므로 window 의 캡처 단계 리스너 하나로 받는다.
// window 와 document 에 따로 달면 버블링되는 이벤트를 두 번 받을 수 있다.
function ensureListening() {
  if (isListening) {
    return;
  }

  window.addEventListener('message', handleMessage, true);
  isListening = true;
}

export function onNativeResponse(listener: ResponseListener): () => void {
  ensureListening();
  responseListeners.add(listener);

  return () => {
    responseListeners.delete(listener);
  };
}

export function onNativeEvent(listener: EventListener): () => void {
  ensureListening();
  eventListeners.add(listener);

  return () => {
    eventListeners.delete(listener);
  };
}

/** 테스트 사이에 리스너와 DOM 이벤트 구독을 비운다. */
export function resetNativeMessageChannelForTest(): void {
  window.removeEventListener('message', handleMessage, true);
  responseListeners.clear();
  eventListeners.clear();
  isListening = false;
}
