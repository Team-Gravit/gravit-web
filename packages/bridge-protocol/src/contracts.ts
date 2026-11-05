/**
 * 웹에서 보낼 수 있는 요청과 네이티브 응답의 payload 계약.
 *
 * 웹과 앱은 서로 다른 시점에 배포된다. 기존 요청의 응답 형태를 바꿔야 하면 새 `type`을
 * 추가한다. 구버전 앱이 모르는 `type`은 `UNSUPPORTED`로 응답한다.
 */
export interface BridgeContracts {
  APP_INFO: {
    request: Record<string, never>;
    result: { platform: 'ios' | 'android'; appVersion: string };
  };
  /**
   * 네이티브 SDK는 제공자 토큰까지만 발급한다. 서비스 세션 토큰으로의 교환은 웹이 맡는다.
   * Google·Kakao는 `idToken`, Naver는 `accessToken`을 반환한다.
   */
  AUTH_LOGIN: {
    request: { provider: 'google' | 'kakao' | 'naver' };
    result: { tokenType: 'idToken' | 'accessToken'; token: string };
  };
}

export type BridgeRequestType = keyof BridgeContracts;
export type BridgeRequestPayload<T extends BridgeRequestType> = BridgeContracts[T]['request'];
export type BridgeResult<T extends BridgeRequestType> = BridgeContracts[T]['result'];

/**
 * 네이티브가 요청 없이 웹에 보내는 이벤트의 payload 계약.
 * 아직 등록된 이벤트는 없다.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BridgeEvents {}

export type BridgeEventType = keyof BridgeEvents;
export type BridgeEventPayload<T extends BridgeEventType> = BridgeEvents[T];
