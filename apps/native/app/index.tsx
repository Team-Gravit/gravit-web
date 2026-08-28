import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0];

const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL ??
  (__DEV__ && devHost ? `http://${devHost}:5173` : 'https://dev.gravit.inuappcenter.kr/');

export default function WebviewPage() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

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
