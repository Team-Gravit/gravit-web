import type { StaticDataRouteOption } from '@tanstack/react-router';

import type { router as appRouter } from '../router/router';

/** 라우트에 상단 색이 없으면 흰색을 쓴다. */
const DEFAULT_BROWSER_TOP_COLOR = '#ffffff';

/**
 * 가장 깊은 라우트의 `browserTopColor`를 쓰고, 없으면 부모 값을 상속한다.
 * 아무도 지정하지 않으면 흰색, `null`을 지정하면 색 지정을 해제한다.
 */
export function resolveBrowserTopColor(
  matches: ReadonlyArray<{ staticData: StaticDataRouteOption }>,
): string | null {
  const routeColor = [...matches]
    .reverse()
    .find((match) => match.staticData.browserTopColor !== undefined)?.staticData.browserTopColor;
  return routeColor === undefined ? DEFAULT_BROWSER_TOP_COLOR : routeColor;
}

/**
 * 라우트가 확정될 때마다 브라우저 상단 색을 화면에 맞춘다. 앱 시작 시 한 번 호출한다.
 *
 * Safari가 상단 색을 정할 때 `theme-color`나 페이지 배경을 참고할 수 있어 둘 다 맞춘다.
 */
export function syncBrowserTopColor(router: typeof appRouter, doc: Document): void {
  router.subscribe('onResolved', () => {
    applyBrowserTopColor(doc, resolveBrowserTopColor(router.state.matches));
  });
}

function applyBrowserTopColor(doc: Document, color: string | null): void {
  doc.documentElement.style.backgroundColor = color ?? '';

  let themeColorMeta = doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (color === null) {
    themeColorMeta?.remove();
    return;
  }

  if (!themeColorMeta) {
    themeColorMeta = doc.createElement('meta');
    themeColorMeta.name = 'theme-color';
    doc.head.append(themeColorMeta);
  }
  themeColorMeta.content = color;
}
