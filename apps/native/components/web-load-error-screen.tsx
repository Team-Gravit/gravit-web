import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 시안이 없어 웹의 오류 화면(`pages/error`, `shared/ui/error-status`) 모바일 구성과 디자인 토큰 값을 옮겼다.
// 시안이 생기면 그에 맞춘다.
const COLOR = {
  bg0: '#FFFFFF',
  text1: '#242424',
  text4: '#A8A8A8',
  cta: '#9B00CF',
  ctaHover: '#6D0689',
  ctaText: '#FBFBFB',
} as const;

export type WebLoadErrorKind = 'network' | 'server';

// iOS NSURLErrorDomain 코드. 기기 쪽 연결이 없는 경우만 'network'로 본다.
const IOS_OFFLINE_CODES = new Set([-1009, -1020, -1018, -1005]);
// 사용자 동작이나 다른 이동으로 취소된 경우, 웹뷰가 열 수 없는 주소(mailto:, tel: 등)는 오류 화면을 띄우지 않는다.
const IOS_IGNORED_CODES = new Set([-999, -1002]);
const WEBKIT_IGNORED_CODES = new Set([101, 102]);
// Android WebViewClient 코드. 오프라인도 HOST_LOOKUP(-2)으로 와서 설명 문자열로 구분한다.
const ANDROID_UNSUPPORTED_SCHEME = -10;
const ANDROID_OFFLINE_DESCRIPTION = 'ERR_INTERNET_DISCONNECTED';

interface WebViewErrorDetail {
  code: number;
  description?: string;
  domain?: string;
}

/**
 * WebView `onError`의 원인을 오류 화면 종류로 바꾼다. 오류 화면을 띄우지 않을 실패면 `null`.
 * 기기 오프라인이 아닌 연결 실패(서버 다운 · 도메인 조회 실패 · 시간 초과 · SSL)는 'server'로 묶는다.
 */
export function classifyWebLoadError({
  code,
  description = '',
  domain,
}: WebViewErrorDetail): WebLoadErrorKind | null {
  if (domain === 'WebKitErrorDomain') {
    return WEBKIT_IGNORED_CODES.has(code) ? null : 'server';
  }

  if (domain === 'NSURLErrorDomain') {
    if (IOS_IGNORED_CODES.has(code)) {
      return null;
    }
    return IOS_OFFLINE_CODES.has(code) ? 'network' : 'server';
  }

  if (code === ANDROID_UNSUPPORTED_SCHEME) {
    return null;
  }
  return description.includes(ANDROID_OFFLINE_DESCRIPTION) ? 'network' : 'server';
}

const MESSAGES: Record<WebLoadErrorKind, { title: string; descriptionLines: string[] }> = {
  network: {
    title: '인터넷에 연결되어 있지 않아요.',
    descriptionLines: ['네트워크 연결을 확인한 뒤', '다시 시도해 주세요.'],
  },
  server: {
    title: '서비스에 연결할 수 없어요.',
    descriptionLines: ['일시적인 문제일 수 있어요.', '잠시 후 다시 시도해 주세요.'],
  },
};

interface WebLoadErrorScreenProps {
  kind: WebLoadErrorKind;
  onRetry: () => void;
}

/** 웹 화면을 불러오지 못했을 때 WebView 대신 보여 주는 화면. 다시 시도하면 WebView를 새로 불러온다. */
export function WebLoadErrorScreen({ kind, onRetry }: WebLoadErrorScreenProps) {
  const insets = useSafeAreaInsets();
  const { title, descriptionLines } = MESSAGES[kind];

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.status}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>{descriptionLines.join('\n')}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>다시 시도</Text>
        </Pressable>
      </View>
    </View>
  );
}

// 수치는 웹 토큰과 같다: heading1 22/600, body2-normal 15/400, headline2 17/600, cta 버튼 h-12 · rounded-8.
const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLOR.bg0,
  },
  status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  title: {
    color: COLOR.text1,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 27.5,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  description: {
    color: COLOR.text4,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: COLOR.cta,
  },
  buttonPressed: {
    backgroundColor: COLOR.ctaHover,
  },
  buttonLabel: {
    color: COLOR.ctaText,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.6,
  },
});
