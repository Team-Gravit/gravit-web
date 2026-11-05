import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * `app.json` 위에 빌드 프로필에 따라 달라지는 설정만 얹는다. 정적 값은 `app.json`에 그대로 둔다.
 *
 * 개발 빌드는 `http://{LAN IP}` 웹 서버에 연결할 수 있도록 평문 HTTP를 허용한다.
 * 미리보기·운영 프로필에서는 이 허용 설정을 끈다.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  // 프로필이 없으면 로컬 개발 설정으로 취급한다.
  const buildProfile = process.env.EAS_BUILD_PROFILE;
  const canUseCleartextTraffic = buildProfile !== 'preview' && buildProfile !== 'production';

  return {
    ...config,
    name: config.name ?? 'native',
    slug: config.slug ?? 'native',
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        ...(canUseCleartextTraffic && {
          NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
        }),
      },
    },
    plugins: [
      ...(config.plugins ?? []),
      ['expo-build-properties', { android: { usesCleartextTraffic: canUseCleartextTraffic } }],
    ],
  };
};
