import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { LoginPageNarrow } from './login-page-narrow';
import { LoginPageWide } from './login-page-wide';

// 두 시안은 배경·구조·문구가 서로 달라 Tailwind 반응형 클래스로 한 트리에 담기 어렵다.
// 그래서 이 화면만 뷰포트로 컴포넌트를 가른다. 크기·여백 차이는 계속 `md:` 로 처리한다.
export function LoginPage() {
  const isWide = useIsWideViewport();

  return isWide ? <LoginPageWide /> : <LoginPageNarrow />;
}
