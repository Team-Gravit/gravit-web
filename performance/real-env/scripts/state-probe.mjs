// URL만으로 열 수 없는 화면 3개를 여는 방법을 확인한다.
// - 레슨 결과 · 온보딩 완료: 앱이 history.state에 넣는 표시를 넣고 새로고침한다 (라우터는 새로고침 뒤에도 state를 읽는다)
// - 온보딩: MSW 없는 빌드에서 스텁의 미온보딩 사용자를 받는다 (MSW는 사용자를 온보딩 완료로 고정한다)
// node state-probe.mjs <puppeteer node_modules/>
import { createRequire } from 'node:module';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
// diagnose.mjs가 import할 때는 argv[3]이 출력 폴더라 포트로 쓰지 않는다.
const ORIGIN = 'http://localhost:4195';

export const STATE_SCREENS = [
  { name: 'lesson-result', path: '/learning/lessons/1/result/1', state: { fromLessonSubmission: true } },
  { name: 'onboarding-success', path: '/onboarding/success', state: { fromOnboarding: true } },
  // MSW 없는 빌드(4195)에서 연다. 사용자 조회가 스텁의 미온보딩 사용자로 간다.
  { name: 'onboarding', path: '/onboarding', origin: 'http://localhost:4195' },
];

/** 화면을 연다. state가 있으면 같은 주소에 state를 심고 새로고침한다. */
export async function openStateScreen(page, screen, gotoOptions) {
  if (!screen.state) {
    return page.goto((screen.origin ?? ORIGIN) + screen.path, gotoOptions);
  }
  // 같은 출처의 가벼운 정적 파일에서 state를 심어 둔다. 앱을 미리 띄우면 캐시가 데워진다.
  await page.goto(`${ORIGIN}/robots.txt`, { timeout: 60000 });
  await page.evaluate(
    (path, state) => history.replaceState({ ...state, __TSR_index: 0, key: 'measure' }, '', path),
    screen.path,
    screen.state,
  );
  return page.reload(gotoOptions);
}

if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const browser = await puppeteer.launch({ headless: true });
  for (const screen of STATE_SCREENS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
    await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
    const api = [];
    page.on('response', (r) => {
      const u = new URL(r.url());
      if (u.pathname.startsWith('/api/v1/')) api.push(`${r.request().method()} ${u.pathname} ${r.status()}`);
    });
    await openStateScreen(page, screen, { waitUntil: 'networkidle0', timeout: 60000 }).catch((e) => console.log('goto', e.message));
    await new Promise((r) => setTimeout(r, 4000));
    await page.screenshot({ path: `shots/${screen.name}.png` });
    console.log(screen.name, '->', new URL(page.url()).pathname, '|', [...new Set(api)].join(', '));
    console.log('   text:', (await page.evaluate(() => document.body.innerText)).slice(0, 120).replace(/\n/g, ' | '));
    await page.close();
  }
  await browser.close();
}
