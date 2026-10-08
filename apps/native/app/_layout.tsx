import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

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
