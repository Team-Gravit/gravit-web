import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  // TODO: 실제 초기 로딩 작업이 추가되면 완료 콜백에서 상태를 갱신한다.
  useEffect(() => {
    // 현재는 로딩 화면 구현 전의 placeholder 상태 전환이다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <></>;

  return (
    <Stack>
      {/** 웹뷰를 띄울 단일 페이지 */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
