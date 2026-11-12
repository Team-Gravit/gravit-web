import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { BridgeHandlers } from '../create-bridge';

/** `APP_INFO` 응답과 WebView User-Agent에 같은 앱 버전을 사용한다. */
export const APP_VERSION = Constants.expoConfig?.version ?? 'unknown';

export const handleAppInfo: BridgeHandlers['APP_INFO'] = () => ({
  platform: Platform.OS === 'ios' ? 'ios' : 'android',
  appVersion: APP_VERSION,
});
