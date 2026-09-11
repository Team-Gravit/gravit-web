import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0];

const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL ??
  (__DEV__ && devHost ? `http://${devHost}:5173` : 'https://dev.gravit.inuappcenter.kr/');

/** 웹이 `dest=local`로 인가 URL을 받으면 제공자가 이 origin으로 돌려보낸다. */
const LOCAL_DEV_ORIGIN = 'http://localhost:5173';

/**
 * 개발 중 OAuth 콜백의 `localhost`를 실제로 웹을 서빙하는 호스트로 바꾼다.
 *
 * 기기에서 `localhost`는 기기 자신이라 제공자의 리다이렉트가 도달하지 못한다. 호스트만 바꾸고
 * 경로·쿼리(`code`)는 그대로 두므로 웹의 코드 교환(`dest=local`)은 서버 검증을 그대로 통과한다.
 * 배포 앱은 웹과 콜백이 같은 도메인이라 해당하지 않는다. 바꿀 필요가 없으면 `null`.
 */
function rewriteLocalDevCallback(url: string): string | null {
  if (!__DEV__ || !url.startsWith(LOCAL_DEV_ORIGIN)) {
    return null;
  }

  return url.replace(LOCAL_DEV_ORIGIN, WEB_URL.replace(/\/+$/, ''));
}

export default function WebviewPage() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [webUri, setWebUri] = useState(WEB_URL);

  const handleShouldStartLoad = ({ url }: { url: string }) => {
    const rewrittenUrl = rewriteLocalDevCallback(url);

    if (!rewrittenUrl) {
      return true;
    }

    setWebUri(rewrittenUrl);
    return false;
  };

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
        source={{ uri: webUri }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        // 기본 UA 뒤에 덧붙인다. `userAgent`로 통째로 바꾸면 WebKit 정보가 사라져 네이버·구글 로그인이
        // 알 수 없는 브라우저로 판단해 차단한다. 웹은 `GravitNative/` 포함 여부로 앱 환경을 판별한다.
        applicationNameForUserAgent="GravitNative/1.0"
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
        onLoadEnd={(event) =>
          console.log('[WebView] load end', {
            url: event.nativeEvent.url,
            loading: event.nativeEvent.loading,
          })
        }
        onError={(event) => console.error('[WebView] error', event.nativeEvent)}
        onHttpError={(event) => console.error('[WebView] HTTP error', event.nativeEvent)}
        onMessage={(event) => console.log('[WebView] browser event', event.nativeEvent.data)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 36,
  },
});
