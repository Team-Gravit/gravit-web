import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

const AppLayout = () => {
    return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
