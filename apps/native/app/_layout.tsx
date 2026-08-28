import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [isLoaded, setIsLoaded] = useState(false);

  // 로딩이 완료됨
  useEffect(() => {
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
