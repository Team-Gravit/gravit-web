import type { ConfigContext, ExpoConfig } from 'expo/config';

type ConfigPlugins = NonNullable<ExpoConfig['plugins']>;

const KAKAO_MAVEN_REPOSITORY = 'https://devrepo.kakao.com/nexus/content/groups/public/';
const GOOGLE_IOS_CLIENT_ID_SUFFIX = '.apps.googleusercontent.com';

/** 스토어(App Store · TestFlight)에 올라가는 빌드 프로필. testflight는 dev 서버를 보지만 같은 바이너리 조건으로 만든다. */
function isStoreBuildProfile(profile: string | undefined): boolean {
  return profile === 'production' || profile === 'testflight';
}

/**
 * 한 SDK 에 필요한 환경변수를 모두 읽는다. 하나라도 없으면 `null` 이다.
 *
 * 운영 빌드는 실패시키고, 그 외에는 경고 후 해당 SDK 설정만 뺀다. 자격 증명이 없어도 다른 기능을
 * 확인할 수 있어야 하기 때문이다. 경고에는 이름만 남기고 값은 남기지 않는다.
 */
function readEnvGroup<T extends string>(
  sdkName: string,
  names: readonly T[],
): Record<T, string> | null {
  const missing = names.filter((name) => !process.env[name]);

  if (missing.length === 0) {
    return Object.fromEntries(names.map((name) => [name, process.env[name]])) as Record<T, string>;
  }

  const message = `[app.config] ${sdkName} 설정이 없다: ${missing.join(', ')}. apps/native/.env 에 넣는다 (.env.example 참고).`;

  if (isStoreBuildProfile(process.env.EAS_BUILD_PROFILE)) {
    throw new Error(message);
  }

  console.warn(`${message} ${sdkName} 설정 없이 진행한다.`);

  return null;
}

/** Google 플러그인이 요구하는 URL scheme 은 iOS 클라이언트 ID 를 뒤집은 값이다. */
function toGoogleIosUrlScheme(iosClientId: string): string {
  const clientName = iosClientId.endsWith(GOOGLE_IOS_CLIENT_ID_SUFFIX)
    ? iosClientId.slice(0, -GOOGLE_IOS_CLIENT_ID_SUFFIX.length)
    : iosClientId;

  return `com.googleusercontent.apps.${clientName}`;
}

/**
 * `app.json` 위에 환경변수와 빌드 프로필에 따라 달라지는 설정만 얹는다.
 *
 * Expo CLI 가 이 파일을 평가할 때 `.env` 를 읽어 `process.env` 에 넣는다 (`EXPO_PUBLIC_` 접두사
 * 불필요 — 번들에 인라인되는 값이 아니라 prebuild 와 `extra` 로 들어가는 값이다).
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  // 값이 없으면 로컬 개발이다. EAS 빌드에서는 프로필 이름이 들어온다.
  const buildProfile = process.env.EAS_BUILD_PROFILE;
  const canUseCleartextTraffic = buildProfile !== 'preview' && !isStoreBuildProfile(buildProfile);

  const plugins: ConfigPlugins = [
    ...(config.plugins ?? []),
    // Apple 로그인은 자격 증명이 앱에 없고 번들 ID 와 권한(entitlement)으로 동작하므로 환경변수가 없다.
    'expo-apple-authentication',
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: canUseCleartextTraffic,
          // 카카오 네이티브 패키지는 설치돼 있으면 키가 없어도 이 저장소가 있어야 빌드된다.
          extraMavenRepos: [KAKAO_MAVEN_REPOSITORY],
        },
      },
    ],
  ];
  const extra: Record<string, unknown> = { ...config.extra };

  const kakao = readEnvGroup('카카오', ['KAKAO_NATIVE_APP_KEY']);

  if (kakao) {
    plugins.push([
      '@react-native-kakao/core',
      {
        nativeAppKey: kakao.KAKAO_NATIVE_APP_KEY,
        // 카카오톡에서 앱으로 돌아오는 URL 을 AppDelegate 가 SDK 로 넘기게 한다. 없으면 카카오톡
        // 로그인 후 앱이 결과를 받지 못한다.
        ios: { handleKakaoOpenUrl: true },
        // 카카오 인증 결과가 앱으로 돌아오는 `kakao{키}://oauth` 경로를 Android 에 등록한다.
        android: { authCodeHandlerActivity: true },
      },
    ]);
    // 네이티브 앱 키는 URL scheme 으로 앱 설정에 들어가는 공개 식별자라 번들에 들어가도 된다.
    extra.kakaoNativeAppKey = kakao.KAKAO_NATIVE_APP_KEY;
  }

  const google = readEnvGroup('Google', ['GOOGLE_IOS_CLIENT_ID', 'GOOGLE_WEB_CLIENT_ID']);

  if (google) {
    plugins.push([
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: toGoogleIosUrlScheme(google.GOOGLE_IOS_CLIENT_ID) },
    ]);
    extra.googleIosClientId = google.GOOGLE_IOS_CLIENT_ID;
    extra.googleWebClientId = google.GOOGLE_WEB_CLIENT_ID;
  }

  const naver = readEnvGroup('네이버', [
    'NAVER_CLIENT_ID',
    'NAVER_CLIENT_SECRET',
    'NAVER_URL_SCHEME',
  ]);

  if (naver) {
    plugins.push(['@react-native-seoul/naver-login', { urlScheme: naver.NAVER_URL_SCHEME }]);
    extra.naverClientId = naver.NAVER_CLIENT_ID;
    // 네이버 SDK 는 초기화에 시크릿을 요구한다. 그래서 앱 안에 들어가고 앱 파일에서 추출될 수 있다.
    extra.naverClientSecret = naver.NAVER_CLIENT_SECRET;
    extra.naverAppName = config.name;
    extra.naverUrlScheme = naver.NAVER_URL_SCHEME;
  }

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
    plugins,
    extra,
  };
};
