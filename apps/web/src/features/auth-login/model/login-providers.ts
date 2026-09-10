/**
 * 지원하는 소셜 로그인 제공자. 화면에 노출하는 순서 그대로다.
 *
 * 이 배열이 원본이고 `LoginProvider` 타입이 여기서 나온다. 제공자를 추가할 때 여기만 고치면
 * 레이블 누락은 `LOGIN_PROVIDER_LABELS`가 타입으로 잡는다.
 */
export const LOGIN_PROVIDERS = ['google', 'kakao', 'naver'] as const;

// 서버 명세는 provider 를 string 으로 두고 있어(orval 생성 타입) 우리가 좁혀서 쓴다.
export type LoginProvider = (typeof LOGIN_PROVIDERS)[number];

export const LOGIN_PROVIDER_LABELS: Record<LoginProvider, string> = {
  google: 'Google로 시작하기',
  kakao: '카카오로 시작하기',
  naver: '네이버로 시작하기',
};

/** 라우트 파라미터처럼 검증되지 않은 문자열이 지원하는 provider 인지 확인한다. */
export function isLoginProvider(value: string): value is LoginProvider {
  return LOGIN_PROVIDERS.some((provider) => provider === value);
}
