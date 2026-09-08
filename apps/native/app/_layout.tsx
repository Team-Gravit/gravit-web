import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// WebView 가 로드될 때까지 정적 스플래시를 붙잡아 둔다. 자동으로 내려가면 웹 첫 화면이 그려지기
// 전에 흰 프레임이 드러난다. 대응하는 hideAsync() 는 app/index.tsx 가 소유한다.
SplashScreen.preventAutoHideAsync().catch(console.warn);

// 정적 스플래시가 사라질 때의 페이드 연출.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
