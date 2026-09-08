import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0];

const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL ??
  (__DEV__ && devHost ? `http://${devHost}:5173` : 'https://dev.gravit.inuappcenter.kr/');

/** WebView와 safe area 여백에 적용하는 흰색 배경. */
const WEB_BACKGROUND = '#ffffff';

/**
 * 로드 결과와 무관하게 스플래시를 내리는 상한.
 * 서버가 응답 없이 매달리면 `onLoadEnd` 도 `onError` 도 오지 않아 스플래시에 갇힌다.
 */
const SPLASH_MAX_WAIT_MS = 10000;

/** 이미 내려간 뒤 다시 불러도 무해하다. */
function hideSplash() {
  SplashScreen.hideAsync().catch(console.warn);
}

export default function WebviewPage() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const timer = setTimeout(hideSplash, SPLASH_MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: Platform.OS === 'android' ? insets.bottom : 0,
        },
      ]}
    >
      <WebView
        ref={webViewRef}
        style={styles.container}
        source={{ uri: WEB_URL }}
        userAgent="GravitNative/1.0"
        cacheEnabled={!__DEV__}
        cacheMode={__DEV__ ? 'LOAD_NO_CACHE' : 'LOAD_DEFAULT'}
        originWhitelist={['*']}
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        injectedJavaScriptBeforeContentLoaded={`
                    (() => {
                        const report = (type, detail) => {
                            window.ReactNativeWebView?.postMessage(
                                JSON.stringify({ type, detail, href: window.location.href }),
                            );
                        };

                        window.addEventListener('error', (event) => {
                            report('window.error', event.message);
                        });
                        window.addEventListener('unhandledrejection', (event) => {
                            report('unhandledrejection', String(event.reason));
                        });
                        document.addEventListener('DOMContentLoaded', () => {
                            report('DOMContentLoaded', document.title);
                        });
                    })();
                    true;
                `}
        onLoadStart={(event) => console.log('[WebView] load start', event.nativeEvent.url)}
        onLoad={(event) => console.log('[WebView] loaded', event.nativeEvent.url)}
        onLoadEnd={(event) => {
          console.log('[WebView] load end', {
            url: event.nativeEvent.url,
            loading: event.nativeEvent.loading,
          });
          hideSplash();
        }}
        onError={(event) => {
          console.error('[WebView] error', event.nativeEvent);
          hideSplash();
        }}
        onHttpError={(event) => {
          console.error('[WebView] HTTP error', event.nativeEvent);
        }}
        onMessage={(event) => console.log('[WebView] browser event', event.nativeEvent.data)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WEB_BACKGROUND,
  },
  container: {
    flex: 1,
    backgroundColor: WEB_BACKGROUND,
  },
});
