import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// WebView 가 로드될 때까지 스플래시를 유지한다. 자동으로 내려가면 웹 첫 화면 전에 흰 화면이 보인다.
// 숨기는 호출은 app/index.tsx 가 맡는다.
SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.warn('[splash] 자동 숨김을 막지 못했다', error);
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// 모든 카카오 API 호출 전에 한 번. 키는 app.config.ts 가 .env 에서 읽어 extra 로 넘긴다.
// 없으면 앱은 뜨게 두고 카카오 로그인만 NATIVE_ERROR 로 실패하게 한다 (dev 에서 .env 누락 시).
const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey;

if (typeof kakaoNativeAppKey === 'string' && kakaoNativeAppKey) {
  initializeKakaoSDK(kakaoNativeAppKey).catch((error: unknown) => {
    console.warn('[kakao] SDK 초기화에 실패했다', error);
  });
} else {
  console.warn('[kakao] extra.kakaoNativeAppKey 가 없어 SDK 를 초기화하지 않는다');
}

export default function RootLayout() {
  return (
    <Stack>
      {/** 웹뷰를 띄울 단일 페이지 */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
