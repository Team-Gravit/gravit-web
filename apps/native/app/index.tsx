import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

export default function Native() {
    const insets = useSafeAreaInsets();
    const webViewRef = useRef<WebView>(null);
    const webViewUrl = 'https://dev.gravit.inuappcenter.kr/';

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
                source={{ uri: webViewUrl }}
                // onMessage={handleMessage}
                // onShouldStartLoadWithRequest={handleShouldStartLoad}
                // onNavigationStateChange={handleNavigationStateChange}
                // 커스텀 스킴 판단을 위 핸들러가 전담하도록 WebView 자체 필터는 열어둔다.
                originWhitelist={['*']}
                // 카카오 로그인 페이지가 새 창으로 앱 전환을 시도하면 Android에서 빈 창만 뜨고 끝난다.
                // 같은 WebView에서 처리하게 해 위 핸들러를 타도록 한다.
                setSupportMultipleWindows={false}
                // OAuth state는 sessionStorage에 있고, 공급자 세션은 서드파티 쿠키에 있다.
                domStorageEnabled
                thirdPartyCookiesEnabled
                sharedCookiesEnabled
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
