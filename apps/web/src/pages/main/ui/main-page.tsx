import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { MainPageNarrow } from './main-page-narrow';
import { MainPageWide } from './main-page-wide';

export function MainPage() {
  // CSS로 한쪽을 숨기면 두 화면이 함께 마운트되어 데이터 요청이 중복되므로 컴포넌트 단위로 분기한다.
  const isWide = useIsWideViewport();

  return isWide ? <MainPageWide /> : <MainPageNarrow />;
}
